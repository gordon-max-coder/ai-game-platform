@echo off
chcp 65001 >nul
echo Creating .learnings directory structure...
cd /d "%~dp0"

mkdir .learnings 2>nul
if errorlevel 1 (
    echo Directory already exists
) else (
    echo Directory created
)

echo Creating log files...

(
echo # 📘 GameAI 项目学习日志
echo.
echo ## 使用说明
echo.
echo 本文件用于记录：
echo - ✅ 发现的更好实践
echo - 🔧 用户纠正的错误
echo - 💡 知识盲区的补充
echo - 🎯 项目特定约定
echo.
echo ## 格式模板
echo.
echo ```markdown
echo ## [LRN-YYYYMMDD-XXX] category
echo.
echo **Logged**: 2025-01-XX
echo **Priority**: low ^| medium ^| high ^| critical
echo **Status**: pending ^| resolved ^| promoted
echo **Area**: frontend ^| backend ^| infra ^| tests ^| docs ^| config
echo.
echo ### Summary
echo 一句话描述学到的内容
echo.
echo ### Details
echo 完整上下文：发生了什么，什么是错的，什么是对的
echo.
echo ### Suggested Action
echo 具体的修复或改进建议
echo.
echo ### Metadata
echo - Source: conversation ^| error ^| user_feedback
echo - Related Files: path/to/file.ext
echo - Tags: tag1, tag2
echo - See Also: LRN-20250110-001 ^(如果相关^)
echo - Pattern-Key: simplify.xxx ^| harden.xxx ^(可选^)
echo.
echo ---
echo ```
echo.
echo ## 已记录的学习
echo.
echo ^!-- 新的学习条目将添加在这里 --^>
echo.
echo ## 统计
echo.
echo - 总计：0
echo - 待处理：0
echo - 已解决：0
echo - 已提升：0
) > .learnings\LEARNINGS.md

(
echo # 🚫 GameAI 项目错误日志
echo.
echo ## 使用说明
echo.
echo 本文件用于记录：
echo - ❌ 命令执行失败
echo - 💥 异常和堆栈跟踪
echo - ⚠️ 意外行为
echo - ⏱️ 超时和连接失败
echo.
echo ## 格式模板
echo.
echo ```markdown
echo ## [ERR-YYYYMMDD-XXX] skill_or_command_name
echo.
echo **Logged**: 2025-01-XX
echo **Priority**: high
echo **Status**: pending ^| resolved
echo **Area**: frontend ^| backend ^| infra ^| tests ^| docs ^| config
echo.
echo ### Summary
echo 简要描述失败内容
echo.
echo ### Error
echo ```
echo 实际错误消息或输出
echo ```
echo.
echo ### Context
echo - 尝试的命令/操作
echo - 使用的输入或参数
echo - 环境详情（如相关）
echo.
echo ### Suggested Fix
echo 可能的解决方案
echo.
echo ### Metadata
echo - Reproducible: yes ^| no ^| unknown
echo - Related Files: path/to/file.ext
echo - See Also: ERR-20250110-001 ^(如果重复出现^)
echo.
echo ---
echo ```
echo.
echo ## 已记录的错误
echo.
echo ^!-- 新的错误条目将添加在这里 --^>
) > .learnings\ERRORS.md

(
echo # 💡 GameAI 项目功能请求
echo.
echo ## 使用说明
echo.
echo 本文件用于记录：
echo - 🎯 用户请求的新功能
echo - 💭 改进建议
echo - 🔮 未来规划
echo.
echo ## 格式模板
echo.
echo ```markdown
echo ## [FEAT-YYYYMMDD-XXX] capability_name
echo.
echo **Logged**: 2025-01-XX
echo **Priority**: medium
echo **Status**: pending ^| in_progress ^| completed
echo **Area**: frontend ^| backend ^| infra ^| tests ^| docs ^| config
echo.
echo ### Requested Capability
echo 用户想要做什么
echo.
echo ### User Context
echo 为什么需要，解决什么问题
echo.
echo ### Complexity Estimate
echo simple ^| medium ^| complex
echo.
echo ### Suggested Implementation
echo 如何构建，可能扩展什么
echo.
echo ### Metadata
echo - Frequency: first_time ^| recurring
echo - Related Features: existing_feature_name
echo.
echo ---
echo ```
echo.
echo ## 已记录的请求
echo.
echo ^!-- 新的功能请求将添加在这里 --^>
) > .learnings\FEATURE_REQUESTS.md

echo.
echo ✅ .learnings directory structure created successfully!
echo.
echo Files created:
echo   - .learnings\LEARNINGS.md
echo   - .learnings\ERRORS.md
echo   - .learnings\FEATURE_REQUESTS.md
echo.
pause
