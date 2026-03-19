@echo off
chcp 65001 >nul
title GameAI Server - Qwen3.5-Plus
cd /d %~dp0
node server.js
pause
