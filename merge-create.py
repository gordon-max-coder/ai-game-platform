# -*- coding: utf-8 -*-
"""
GameAI - create.html 文件合并脚本
将 create-parts 目录下的所有 HTML 片段合并成完整的 create.html
"""

import os

# 定义文件路径
parts_dir = 'create-parts'
output_file = 'create.html'

# 按顺序列出所有部分文件
part_files = [
    '01-header.html',
    '02-sidebar.html',
    '03-main-content.html',
    '04-create-form.html',
    '05-progress-section.html',
    '06-result-section.html',
    '07-modify-section.html',
    '08-example-prompts.html',
    '09-log-section.html',
    '10-close-container.html',
    '11-scripts.html',
    '12-footer.html'
]

# 读取每个部分并合并
content = []
missing_files = []

for part_file in part_files:
    file_path = os.path.join(parts_dir, part_file)
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            part_content = f.read()
            content.append(part_content)
            print(f'✅ 已加载：{part_file}')
    else:
        missing_files.append(part_file)
        print(f'❌ 缺失：{part_file}')

if missing_files:
    print(f'\n⚠️ 警告：缺少 {len(missing_files)} 个文件')
    print('缺失的文件：', ', '.join(missing_files))
    print('\n请创建这些文件后再运行合并脚本')
    exit(1)

# 合并所有内容
final_content = '\n'.join(content)

# 写入输出文件
with open(output_file, 'w', encoding='utf-8') as f:
    f.write(final_content)

print(f'\n✅ 成功合并！')
print(f'输出文件：{output_file}')
print(f'文件大小：{len(final_content)} 字节')
print(f'部分数量：{len(content)}')
