import importlib.util
import tempfile
import unittest
from pathlib import Path
spec=importlib.util.spec_from_file_location('export_waves',Path(__file__).resolve().parents[1]/'scripts/export_waves.py')
module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)

class WaveParserTests(unittest.TestCase):
    def test_scalar_bus_unknown_alias_and_scope(self):
        fixture='''$timescale 1ps $end
$scope module tb $end
$var reg 1 ! clk $end
$var wire 4 " q [3:0] $end
$var wire 4 " count [3:0] $end
$var integer 32 # i [31:0] $end
$scope module dut $end
$var wire 4 $ internal [3:0] $end
$upscope $end
$upscope $end
$enddefinitions $end
#0
0!
bxxxx "
b0 #
b1010 $
#5000
1!
b1010 "
#5000
b1011 "
#10000
0!
'''
        with tempfile.TemporaryDirectory() as folder:
            path=Path(folder)/'input.vcd';path.write_text(fixture);wave=module.read_vcd(path)
        self.assertEqual(wave['duration'],10)
        self.assertEqual(wave['widths']['q'],4)
        self.assertEqual(wave['signals']['q'],[[0,'xxxx'],[5,'11']])
        self.assertEqual(wave['signals']['count'],wave['signals']['q'])
        self.assertNotIn('i',wave['signals']);self.assertNotIn('internal',wave['signals'])

if __name__=='__main__':unittest.main()
