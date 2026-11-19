`timescale 1ns/1ps
module tb;
  reg clk = 0, rst = 1, en = 0;
  reg [3:0] d = 0;
  wire [3:0] q;
  register_demo dut(.clk(clk), .rst(rst), .en(en), .d(d), .q(q));
  always #5 clk = ~clk;
  task step;
    begin @(posedge clk); #1; end
  endtask
  initial begin
    step();
    if (q !== 0) $fatal(1, "FAIL register reset");
    rst = 0; en = 1; d = 9;
    #2;
    if (q !== 0) $fatal(1, "FAIL register changed without rising edge");
    step();
    if (q !== 9) $fatal(1, "FAIL register enabled capture");
    d = 6; en = 0;
    step();
    if (q !== 9) $fatal(1, "FAIL register disabled hold");
    en = 1;
    #2;
    if (q !== 9) $fatal(1, "FAIL register high-level clock must hold");
    step();
    if (q !== 6) $fatal(1, "FAIL register second capture");
    rst = 1; en = 1; d = 15;
    #2;
    if (q !== 6) $fatal(1, "FAIL register reset must be synchronous");
    step();
    if (q !== 0) $fatal(1, "FAIL register reset must win over enable");
    $display("PASS 05_register: edge capture, hold and synchronous reset priority checked");
    $finish;
  end
endmodule
