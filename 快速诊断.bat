@echo off
chcp 65001 >nul
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║         🔍 API 配置快速诊断                                   ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.

setlocal enabledelayedexpansion

:: 检查 .env 文件
if not exist .env (
    echo ❌ .env 文件不存在
    echo    请复制 .env.example 为 .env 并配置 API Key
    pause
    exit /b 1
)

echo ✅ .env 文件存在
echo.

:: 读取配置
for /f "tokens=2 delims==" %%a in ('findstr /R "^API_PROVIDER=" .env') do set PROVIDER=%%a
for /f "tokens=2 delims==" %%a in ('findstr /R "^API_KEY=" .env') do set KEY=%%a
for /f "tokens=2 delims==" %%a in ('findstr /R "^MODEL=" .env') do set MODEL=%%a

echo 当前配置:
echo   API 厂商：%PROVIDER%
echo   API Key: %KEY:~0,15%...
echo   模型：%MODEL%
echo.

:: 检查 API Key 格式
if "%PROVIDER%"=="aliyun" (
    echo 检查阿里云 API Key 格式...
    echo !KEY! | findstr /R "^sk-[a-z0-9-]*" >nul
    if errorlevel 1 (
        echo ⚠️  API Key 格式可能不正确
        echo    阿里云 API Key 通常以 sk- 开头
    ) else (
        echo ✅ API Key 格式正确
    )
) else if "%PROVIDER%"=="jiekou" (
    echo 检查 jiekou.ai API Key 格式...
    echo ✅ jiekou.ai API Key 格式跳过检查
)

echo.

:: 检查服务器状态
echo 检查服务器状态...
netstat -ano | findstr ":3000" >nul
if errorlevel 1 (
    echo ⚠️  服务器未运行在端口 3000
    echo    请运行：启动服务器.bat
) else (
    echo ✅ 服务器正在运行
)

echo.

:: 检查节点进程
echo 检查 Node.js 进程...
tasklist | findstr "node.exe" >nul
if errorlevel 1 (
    echo ⚠️  未检测到 node.exe 进程
) else (
    echo ✅ Node.js 进程运行中
)

echo.

:: 网络连通性测试
if "%PROVIDER%"=="aliyun" (
    echo 测试阿里云 API 端点连通性...
    ping -n 1 -w 1000 dashscope.aliyuncs.com >nul
    if errorlevel 1 (
        echo ⚠️  无法连接到 dashscope.aliyuncs.com
        echo    检查网络连接
    ) else (
        echo ✅ 网络连通正常
    )
)

echo.
echo ═══════════════════════════════════════════════════════════════
echo 建议操作:
echo.
if "%PROVIDER%"=="aliyun" (
    echo 1. 访问 https://dashscope.console.aliyun.com/apiKey
    echo 2. 验证 API Key 是否有效
    echo 3. 运行「更新 APIKey.bat」配置新 Key
    echo 4. 运行「测试阿里云 API.bat」验证
) else (
    echo 1. 运行「测试 API.bat」验证 jiekou.ai 连接
    echo 2. 如失败，检查 jiekou.ai 控制台
)
echo ═══════════════════════════════════════════════════════════════
echo.

pause
