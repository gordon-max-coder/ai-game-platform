# Git 编码配置 - 防止中文乱码

## 1. Git 全局配置

```bash
# 设置 Git 使用 UTF-8
git config --global core.autocrlf false
git config --global core.safecrlf false
git config --global core.quotepath false
git config --global gui.encoding utf-8
git config --global i18n.commitencoding utf-8
git config --global i18n.logoutputencoding utf-8

# 设置 diff 使用 UTF-8
git config --global diff.charset utf-8

# 设置 pager 使用 UTF-8
git config --global core.pager "less -r"
```

## 2. 项目级配置

在项目根目录创建 `.gitattributes` 文件：

```gitattributes
# 所有文本文件使用 UTF-8
* text=auto eol=LF working-tree-encoding=UTF-8

# 特定文件类型
*.html text eol=LF working-tree-encoding=UTF-8
*.css text eol=LF working-tree-encoding=UTF-8
*.js text eol=LF working-tree-encoding=UTF-8
*.md text eol=LF working-tree-encoding=UTF-8
*.json text eol=LF working-tree-encoding=UTF-8
*.bat text eol=CRLF working-tree-encoding=UTF-8
*.cmd text eol=CRLF working-tree-encoding=UTF-8

# 二进制文件
*.png binary
*.jpg binary
*.gif binary
*.svg binary
*.ico binary
```

## 3. 编辑器配置

### VS Code 设置

在项目根目录创建 `.vscode/settings.json`：

```json
{
    "files.encoding": "utf8",
    "files.autoGuessEncoding": true,
    "files.eol": "\n",
    "files.insertFinalNewline": true,
    "files.trimTrailingWhitespace": true,
    "[html]": {
        "files.encoding": "utf8"
    },
    "[javascript]": {
        "files.encoding": "utf8"
    },
    "[markdown]": {
        "files.encoding": "utf8"
    }
}
```

## 4. PowerShell 配置

创建 PowerShell 配置文件 `profile.ps1`：

```powershell
# 设置默认编码为 UTF-8
$PSDefaultParameterValues["Out-File:Encoding"] = "UTF8"
$PSDefaultParameterValues["Set-Content:Encoding"] = "UTF8"
$PSDefaultParameterValues["Add-Content:Encoding"] = "UTF8"
$PSDefaultParameterValues["Write-Output:Encoding"] = "UTF8"

# 设置控制台编码
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::InputEncoding = [System.Text.Encoding]::UTF8
```

## 5. 批处理文件模板

所有批处理文件开头必须包含：

```batch
@echo off
chcp 65001 >nul
REM 设置代码页为 UTF-8
```

## 6. 文件修改最佳实践

### ✅ 正确方式

**PowerShell**：
```powershell
# 明确指定 UTF-8 with BOM
$content = Get-Content file.html -Raw -Encoding UTF8
# 修改内容...
[System.IO.File]::WriteAllText("file.html", $content, 
    (New-Object System.Text.UTF8Encoding $true))  # $true = with BOM
```

**批处理**：
```batch
@echo off
chcp 65001 >nul
copy source.html target.html
```

**Node.js**：
```javascript
const fs = require('fs');
// 读取
const content = fs.readFileSync('file.html', 'utf8');
// 写入
fs.writeFileSync('file.html', content, 'utf8');
```

### ❌ 错误方式

```powershell
# 未指定编码 - 可能使用系统默认
Set-Content file.html $content

# 使用 Out-File 未指定编码
$content | Out-File file.html
```

## 7. 验证脚本

创建 `verify-encoding.bat`：

```batch
@echo off
chcp 65001 >nul
echo Checking file encodings...

for %%f in (*.html *.css *.js) do (
    echo Checking %%f...
    powershell -Command "$content = Get-Content '%%f' -Raw; if ($content -match '[\u4e00-\u9fa5]') { Write-Host '  ✓ Contains Chinese' -ForegroundColor Green } else { Write-Host '  - No Chinese' -ForegroundColor Gray }"
)

pause
```

## 8. 自动修复脚本

创建 `fix-encoding.bat`：

```batch
@echo off
chcp 65001 >nul
echo Fixing file encodings...

for %%f in (*.html *.css *.js) do (
    echo Fixing %%f...
    powershell -Command "$content = Get-Content '%%f' -Raw -Encoding UTF8; [System.IO.File]::WriteAllText('%%f', $content, (New-Object System.Text.UTF8Encoding $true))"
)

echo Done!
pause
```

## 9. Git Hooks

创建 `.git/hooks/pre-commit`：

```bash
#!/bin/bash
# 检查暂存文件的编码

echo "Checking file encodings..."

# 获取暂存的文件列表
files=$(git diff --cached --name-only --diff-filter=ACM)

for file in $files; do
    # 只检查文本文件
    if [[ $file == *.html || $file == *.css || $file == *.js || $file == *.md ]]; then
        echo "Checking $file..."
        # 可以添加编码检查逻辑
    fi
done

echo "Encoding check complete."
exit 0
```

## 10. 快速检查命令

```bash
# 检查文件是否包含中文
powershell -Command "Get-Content 'file.html' | Select-String '[\u4e00-\u9fa5]'"

# 检查文件编码
powershell -Command "Get-Content 'file.html' -Raw | ForEach-Object { [System.Text.Encoding]::UTF8.GetBytes($_).Length }"

# Git 状态
git status

# 查看 Git 配置
git config --list | findstr encoding
```

## 11. 问题排查流程

```
发现乱码
  ↓
1. 检查文件实际编码
   powershell: Get-Content file.html -Raw
  ↓
2. 检查 Git 配置
   git config --list | findstr encoding
  ↓
3. 检查 .gitattributes
   是否存在并正确配置
  ↓
4. 检查编辑器设置
   VS Code 右下角编码显示
  ↓
5. 修复编码
   使用 fix-encoding.bat
  ↓
6. 重新提交
   git add -A
   git commit -m "fix: Fix file encoding"
```

## 12. 预防措施清单

每次修改文件前检查：
- [ ] 编辑器编码设置为 UTF-8
- [ ] PowerShell 使用 -Encoding UTF8 参数
- [ ] 批处理文件包含 chcp 65001
- [ ] Git 配置正确
- [ ] .gitattributes 存在

每次提交前检查：
- [ ] 文件显示正常
- [ ] git diff 显示正常
- [ ] 中文无乱码

---

**配置完成时间**: 2025-01-XX  
**状态**: ✅ 已配置  
**维护**: 定期检查
