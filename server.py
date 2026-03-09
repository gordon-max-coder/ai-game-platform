"""
简单的 HTTP 服务器，带 API 代理功能
解决 CORS 问题并托管前端文件
"""

from http.server import HTTPServer, SimpleHTTPRequestHandler
import urllib.request
import urllib.parse
import json
import ssl

# API 配置
API_KEY = "sk_JBi4qif6ZdbrujP34ZPvCcrypaSwDrk5I7vvZiNdsh8"
API_BASE_URL = "https://jiekou.ai/api"

class CORSRequestHandler(SimpleHTTPRequestHandler):
    # 添加 CORS 头
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()
    
    # 处理 OPTIONS 预检请求
    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()
    
    # 处理 POST 请求（用于 API 代理）
    def do_POST(self):
        if self.path.startswith('/proxy/'):
            # 代理 API 请求
            self.handle_proxy_request()
        else:
            self.send_response(404)
            self.end_headers()
    
    def handle_proxy_request(self):
        try:
            # 读取请求体
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            
            # 获取目标 URL
            target_path = self.path.replace('/proxy/', '')
            target_url = f"{API_BASE_URL}/{target_path}"
            
            # 创建请求
            req = urllib.request.Request(
                target_url,
                data=post_data,
                headers={
                    'Content-Type': 'application/json',
                    'Authorization': f'Bearer {API_KEY}'
                },
                method='POST'
            )
            
            # 忽略 SSL 证书验证（如果需要）
            context = ssl._create_unverified_context()
            
            # 发送请求
            with urllib.request.urlopen(req, context=context, timeout=60) as response:
                response_data = response.read()
                
                # 返回响应
                self.send_response(response.status)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(response_data)
                
        except Exception as e:
            error_response = {
                "error": str(e),
                "type": type(e).__name__
            }
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(error_response).encode())
    
    # 处理 GET 请求
    def do_GET(self):
        # API 健康检查
        if self.path == '/api/health':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            response = {
                "status": "ok",
                "service": "AI Game Generator Proxy",
                "message": "使用此服务器解决 CORS 问题"
            }
            self.wfile.write(json.dumps(response).encode())
            return
        
        # 其他请求交给默认处理
        super().do_GET()


def run_server(port=8080):
    print("=" * 60)
    print("🎮 AI 游戏生成平台 - 本地服务器")
    print("=" * 60)
    print(f"📍 服务地址：http://localhost:{port}")
    print(f"📁 工作目录：C:\\Users\\jiangym\\.copaw\\ai-game-platform")
    print("=" * 60)
    print()
    print("📖 使用说明：")
    print(f"1. 在浏览器中打开：http://localhost:{port}/create.html")
    print(f"2. 首页地址：http://localhost:{port}/index.html")
    print(f"3. API 健康检查：http://localhost:{port}/api/health")
    print()
    print("⚠️  按 Ctrl+C 停止服务")
    print("=" * 60)
    
    server = HTTPServer(('0.0.0.0', port), CORSRequestHandler)
    server.serve_forever()


if __name__ == '__main__':
    try:
        run_server(8080)
    except KeyboardInterrupt:
        print("\n\n服务器已停止。")
    except Exception as e:
        print(f"\n错误：{e}")
