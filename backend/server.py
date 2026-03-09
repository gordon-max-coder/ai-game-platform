"""
AI 游戏生成后端服务
使用 Claude API 生成 HTML5 游戏
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json
from config import API_KEY, API_BASE_URL, MODEL_NAME, SYSTEM_PROMPT

app = Flask(__name__)
CORS(app)  # 允许跨域请求

def generate_game_code(prompt: str, game_type: str = "", art_style: str = "", difficulty: str = "medium") -> str:
    """
    调用 Claude API 生成游戏代码
    
    Args:
        prompt: 用户的游戏描述
        game_type: 游戏类型
        art_style: 美术风格
        difficulty: 难度等级
    
    Returns:
        生成的 HTML 游戏代码
    """
    
    # 构建完整的提示
    full_prompt = f"""请创建一个完整的 HTML5 游戏。

游戏描述：{prompt}
"""
    
    if game_type:
        full_prompt += f"\n游戏类型：{game_type}"
    if art_style:
        full_prompt += f"\n美术风格：{art_style}"
    if difficulty:
        full_prompt += f"\n难度等级：{difficulty}"
    
    full_prompt += """

请生成一个完整的、可立即运行的 HTML5 游戏。要求：
1. 单个 HTML 文件，包含所有 CSS 和 JavaScript
2. 使用 Canvas API 渲染
3. 包含完整的游戏循环、玩家控制、碰撞检测
4. 有得分系统和游戏结束判定
5. 添加精美的视觉效果和动画
6. 确保游戏有趣且可玩

只返回纯 HTML 代码，不要有任何解释。"""

    # API 请求头
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    # API 请求体 - 兼容多种 API 格式
    payload = {
        "model": MODEL_NAME,
        "messages": [
            {
                "role": "system",
                "content": SYSTEM_PROMPT
            },
            {
                "role": "user",
                "content": full_prompt
            }
        ],
        "max_tokens": 8000,
        "temperature": 0.7
    }
    
    try:
        # 尝试调用 API
        response = requests.post(
            f"{API_BASE_URL}/chat/completions",
            headers=headers,
            json=payload,
            timeout=60
        )
        
        if response.status_code == 200:
            result = response.json()
            # 提取生成的内容
            game_code = result["choices"][0]["message"]["content"]
            
            # 清理代码，提取 HTML 部分
            game_code = extract_html_code(game_code)
            
            return game_code
        else:
            error_msg = f"API 请求失败：{response.status_code}"
            print(f"错误响应：{response.text}")
            return f"<!-- 错误：{error_msg} -->\n{response.text}"
            
    except requests.exceptions.Timeout:
        return "<!-- 错误：API 请求超时 -->"
    except requests.exceptions.RequestException as e:
        return f"<!-- 错误：网络错误 - {str(e)} -->"
    except Exception as e:
        return f"<!-- 错误：{str(e)} -->"


def extract_html_code(text: str) -> str:
    """
    从响应文本中提取 HTML 代码
    
    Args:
        text: API 返回的文本
    
    Returns:
        纯 HTML 代码
    """
    # 移除可能的 markdown 代码块标记
    if "```html" in text:
        start = text.find("```html") + 7
        end = text.find("```", start)
        if end != -1:
            text = text[start:end].strip()
    elif "```" in text:
        start = text.find("```") + 3
        end = text.find("```", start)
        if end != -1:
            text = text[start:end].strip()
    
    # 确保以 DOCTYPE 开头
    if not text.strip().startswith("<!DOCTYPE"):
        # 查找第一个 <html> 标签
        html_start = text.lower().find("<html")
        if html_start != -1:
            # 找到 DOCTYPE 或 html 标签的开始位置
            doctype_start = text.lower().find("<!doctype")
            if doctype_start != -1 and doctype_start < html_start:
                text = text[doctype_start:]
            else:
                text = "<!DOCTYPE html>\n" + text[html_start:]
    
    return text


@app.route('/api/generate', methods=['POST'])
def generate_game():
    """
    生成游戏 API 端点
    
    请求体:
    {
        "prompt": "游戏描述",
        "gameType": "游戏类型（可选）",
        "artStyle": "美术风格（可选）",
        "difficulty": "难度（可选）"
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'prompt' not in data:
            return jsonify({
                "success": False,
                "error": "缺少游戏描述 (prompt)"
            }), 400
        
        prompt = data['prompt']
        game_type = data.get('gameType', '')
        art_style = data.get('artStyle', '')
        difficulty = data.get('difficulty', 'medium')
        
        # 生成游戏代码
        game_code = generate_game_code(prompt, game_type, art_style, difficulty)
        
        # 检查是否生成成功
        if game_code.startswith("<!-- 错误："):
            return jsonify({
                "success": False,
                "error": game_code
            }), 500
        
        return jsonify({
            "success": True,
            "gameCode": game_code,
            "prompt": prompt,
            "metadata": {
                "gameType": game_type,
                "artStyle": art_style,
                "difficulty": difficulty
            }
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route('/api/health', methods=['GET'])
def health_check():
    """健康检查端点"""
    return jsonify({
        "status": "ok",
        "service": "AI Game Generator",
        "model": MODEL_NAME
    })


@app.route('/')
def index():
    """根路径说明"""
    return """
    <h1>AI 游戏生成后端服务</h1>
    <p>服务正在运行中...</p>
    
    <h2>API 端点:</h2>
    <ul>
        <li><code>POST /api/generate</code> - 生成游戏</li>
        <li><code>GET /api/health</code> - 健康检查</li>
    </ul>
    
    <h2>使用示例:</h2>
    <pre>
curl -X POST http://localhost:5000/api/generate \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "创建一个太空射击游戏",
    "gameType": "action",
    "artStyle": "pixel",
    "difficulty": "medium"
  }'
    </pre>
    """


if __name__ == '__main__':
    print("=" * 50)
    print("🎮 AI 游戏生成后端服务")
    print("=" * 50)
    print(f"模型：{MODEL_NAME}")
    print(f"API 地址：{API_BASE_URL}")
    print("=" * 50)
    print("🚀 服务启动中...")
    print("=" * 50)
    
    app.run(debug=True, host='0.0.0.0', port=5000)
