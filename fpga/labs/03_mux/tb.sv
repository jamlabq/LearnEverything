`timescale 1ns/1ps
module tb;
  reg a = 0, b = 0, sel = 0;
  wire y;
  mux_demo dut(.a(a), .b(b), .sel(sel), .y(y));
  integer i;
  initial begin
    for (i = 0; i < 8; i = i + 1) begin
      {sel,a,b} = i;
      #10;
      // sel=0 应选 A，sel=1 应选 B；穷举所有输入。
      if ((sel === 1'b0 && y !== a) || (sel === 1'b1 && y !== b))
        $fatal(1, "FAIL mux sel=%b a=%b b=%b y=%b", sel, a, b, y);
    end
    $display("PASS 03_mux: all 8 input combinations checked");
    $finish;
  end
endmodule
