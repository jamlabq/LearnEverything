`timescale 1ns/1ps
module tb;
  reg clk = 0, rst = 1, en = 0;
  wire [3:0] count;
  wire wrap;
  counter_demo dut(.clk(clk), .rst(rst), .en(en), .count(count), .wrap(wrap));
  always #5 clk = ~clk;
  task step;
    begin @(posedge clk); #1; end
  endtask
  integer i;
  initial begin
    step();
    if (count !== 0 || wrap !== 0) $fatal(1, "FAIL counter reset");
    rst = 0; en = 1;
    for (i = 1; i <= 15; i = i + 1) begin
      step();
      if (count !== i[3:0] || wrap !== 0) $fatal(1, "FAIL counter increment %0d", i);
    end
    en = 0;
    step();
    if (count !== 15 || wrap !== 0) $fatal(1, "FAIL counter pause at 15");
    en = 1;
    step();
    if (count !== 0 || wrap !== 1) $fatal(1, "FAIL counter 15 to 0 wrap");
    en = 0;
    step();
    if (count !== 0 || wrap !== 0) $fatal(1, "FAIL counter wrap must clear while paused");
    en = 1;
    step();
    if (count !== 1 || wrap !== 0) $fatal(1, "FAIL counter resume");
    rst = 1;
    step();
    if (count !== 0 || wrap !== 0) $fatal(1, "FAIL counter reset priority");
    $display("PASS 06_counter: 15 to 0, pause, wrap pulse and reset checked");
    $finish;
  end
endmodule
