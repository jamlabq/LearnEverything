#!/usr/bin/env python3
"""Export the two companion workshops from actual XSim records."""
import json
from export_waves import ROOT, read_vcd
result={}
for name in ('old_values','button_counter'):
    folder=ROOT/'workshops'/name
    result[name]={'wave':read_vcd(ROOT/'build'/f'workshop_{name}'/'signals.vcd'),
                  'design':(folder/'design.v').read_text(),
                  'testbench':(folder/'tb.sv').read_text(), 'tool':'XSim 2022.2'}
(ROOT/'src'/'workshop-data.js').write_text('// Generated from actual XSim VCD.\nexport const workshopData = '+json.dumps(result,ensure_ascii=False,indent=2)+';\n')
print('Exported two XSim workshops.')
