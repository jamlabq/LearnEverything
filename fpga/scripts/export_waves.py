#!/usr/bin/env python3
"""将本教程 XSim VCD 的顶层标量和多位信号转成网页数据，并打包离线实验。"""
import json
import re
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LABS = tuple(p.name for p in sorted((ROOT / 'labs').glob('[0-9][0-9]_*')) if p.is_dir())

def read_vcd(path, max_time=None):
    source = path.read_text()
    match = re.search(r'\$timescale\s+(\d+)\s*(s|ms|us|ns|ps|fs)\s+\$end', source)
    if not match:
        raise ValueError(f'VCD 缺少 timescale: {path}')
    scales = {'s':1e9,'ms':1e6,'us':1e3,'ns':1,'ps':1e-3,'fs':1e-6}
    scale = int(match[1]) * scales[match[2]]
    scope, names, changes, widths = [], {}, {}, {}
    current_time, end = 0, 0
    for raw in source.splitlines():
        line = raw.strip()
        if line.startswith('$scope'):
            scope.append(line.split()[2])
        elif line.startswith('$upscope'):
            scope.pop()
        elif line.startswith('$var') and scope == ['tb']:
            fields = line.split()
            code, name = fields[3:5]
            # 排除测试台计分板和循环变量，只展示电路端口/教学别名。
            if fields[1] in ('reg', 'wire') and not name.startswith(('previous_', 'expected_')):
                names.setdefault(code, []).append(name)
                changes[name] = []
                widths[name] = int(fields[2])
        elif line.startswith('#'):
            current_time = round(int(line[1:]) * scale, 6)
            if max_time is not None and current_time > max_time:
                end = max_time
                break
            end = max(end, current_time)
        else:
            code = value = None
            if line.startswith(('b', 'B')) and len(line.split()) == 2:
                raw_value, code = line.split()
                bits = raw_value[1:].lower()
                value = bits if any(c in bits for c in 'xz') else str(int(bits, 2))
            elif line and line[0] in '01xXzZ':
                code, value = line[1:], line[0].lower()
            if code in names:
                for name in names[code]:
                    points = changes[name]
                    if points and points[-1][0] == current_time:
                        points[-1] = [current_time, value]
                    elif not points or points[-1][1] != value:
                        points.append([current_time, value])
    changes = {name: points for name, points in changes.items() if points}
    if not changes or not end:
        raise ValueError(f'无可用顶层波形: {path}')
    return {'unit':'ns', 'duration':end, 'widths':{name:widths[name] for name in changes}, 'signals':changes}

def main():
    if '--package-only' not in sys.argv:
        result = {}
        for lab in LABS:
            wave = ROOT / 'build' / lab / 'signals.vcd'
            result[lab] = {
                'wave':read_vcd(wave, 320 if lab == '12_alu' else None),
                'excerpt': 'ALU 展示开头 320 ns 的 32 组代表输入；完整自检还遍历全部 524288 种组合。' if lab == '12_alu' else '',
                'design':(ROOT / 'labs' / lab / 'design.v').read_text(),
                'testbench':(ROOT / 'labs' / lab / 'tb.sv').read_text(),
                'tool':'XSim 2022.2',
            }
        target = ROOT / 'src' / 'lab-data.js'
        target.write_text('// 由 scripts/export_waves.py 根据真实 XSim VCD 生成。\nexport const labData = ' + json.dumps(result, ensure_ascii=False, indent=2) + ';\n')
    with zipfile.ZipFile(ROOT / 'assets' / 'fpga-labs.zip', 'w', zipfile.ZIP_DEFLATED) as archive:
        for folder in ('labs', 'workshops', 'scripts', 'src', 'tests'):
            for path in sorted((ROOT / folder).rglob('*')):
                if path.is_file() and '__pycache__' not in path.parts:
                    archive.write(path, path.relative_to(ROOT))
        for relative in ('README.md', 'index.html', 'assets/style.css', 'assets/favicon.svg'):
            archive.write(ROOT / relative, relative)
    print('已打包完整二十课教程与实验。' if '--package-only' in sys.argv else '已导出二十课真实仿真波形、源码和实验包。')

if __name__ == '__main__':
    main()
