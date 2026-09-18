# pip install fonttools

import os
import re
import subprocess

# 配置部分
font_list = [
    'PangMenZhengDao.ttf',
    'YouSheBiaoTiHei.ttf',
]
output_suffix = '-min'  # 可以自定义，例如：'-subset', '-compressed'

# 读取文本内容
try:
    with open('./text.txt', encoding='utf-8') as t:
        source_content = t.read()
except FileNotFoundError:
    print('错误：text.txt 文件未找到')
    exit(1)

# 提取字符集（去空白，去重）
text = ''.join(set(re.sub(r'\s', '', source_content)))

if not text:
    print('警告：提取字符集为空，可能生成空字体')
else:
    print(f'字符集（{len(text)} 个字符）：{text}')

# 循环处理每个字体
for font_path in font_list:
    if not os.path.exists(font_path):
        print(f'跳过：找不到字体文件 {font_path}')
        continue

    font_name, ext = os.path.splitext(font_path)
    output_font_path = f'{font_name}{output_suffix}{ext}'

    cmd = [
        'pyftsubset',
        font_path,
        f'--text={text}',
        f'--output-file={output_font_path}'
    ]

    print(f'\n正在处理字体：{font_path} -> {output_font_path}')

    try:
        subprocess.run(cmd, check=True)
        print(f'✅ 成功：生成子集字体 {output_font_path}')
    except subprocess.CalledProcessError as e:
        print(f'❌ 失败：生成 {output_font_path} 时出错：', e)
