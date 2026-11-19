`timescale 1ns/1ps
// 测试台只在仿真器运行，不会下载到 FPGA。
module tb;
  reg a = 0, b = 0;
  wire y_and, y_xor, y_not;
  parallel_demo dut(.a(a), .b(b), .y_and(y_and), .y_xor(y_xor), .y_not(y_not));
  integer i;
  initial begin
    for (i = 0; i < 4; i = i + 1) begin
      {a,b} = i;
      #10; // 输入保持 10ns，便于在波形中观察；不是电路延迟。
      if ({y_and,y_xor,y_not} !== {(a & b),(a ^ b),(~a)})
        $fatal(1, "FAIL parallel a=%b b=%b", a, b);
    end
    $display("PASS 01_parallel: all 4 input combinations checked");
    $finish;
  end
endmodule
