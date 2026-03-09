@echo off
echo ================================================
echo   AI 游戏生成平台 - 后端服务启动器
echo ================================================
echo.

cd /d "%~dp0"

echo 检查 Python 安装...
python --version >nul 2>&1
if errorlevel 1 (
    echo [错误] 未找到 Python，请先安装 Python 3.8+
    echo 下载地址：https://www.python.org/downloads/
    pause
    exit /b 1
)

echo [✓] Python 已安装
echo.

echo 安装依赖包...
pip install -r requirements.txt
if errorlevel 1 (
    echo [错误] 依赖安装失败
    pause
    exit /b 1
)

echo [✓] 依赖安装完成
echo.

echo ================================================
echo   启动后端服务...
echo ================================================
echo.
echo API 地址：http://localhost:5000
echo 文档：http://localhost:5000
echo.
echo 按 Ctrl+C 停止服务
echo.

python server.py

pause
