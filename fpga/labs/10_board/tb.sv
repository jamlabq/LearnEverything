`timescale 1ns/1ps
module tb;
  reg clk = 0, rst = 1;
  wire led, led_fast;
  board_demo dut(.clk(clk), .rst(rst), .led(led));
  board_demo #(.HALF_PERIOD(1)) boundary(.clk(clk), .rst(rst), .led(led_fast));
  wire [1:0] count = dut.count;
  wire count_fast = boundary.count;
  always #5 clk = ~clk;
  task step;
    begin @(posedge clk); #1; end
  endtask
  integer i, expected_count;
  initial begin
    step();
    if (led !== 0 || led_fast !== 0 || count !== 0 || count_fast !== 0)
      $fatal(1, "FAIL board reset");
    rst = 0;
    for (i = 1; i <= 20; i = i + 1) begin
      step();
      expected_count = i % 4;
      if (led !== ((i / 4) % 2) || count !== expected_count[1:0] || led_fast !== (i % 2) || count_fast !== 0)
        $fatal(1, "FAIL board cycle=%0d count=%0d led=%b fast=%b", i, count, led, led_fast);
    end
    rst = 1;
    #2;
    if (led !== 1) $fatal(1, "FAIL board reset must be synchronous");
    step();
    if (led !== 0 || led_fast !== 0 || count !== 0 || count_fast !== 0)
      $fatal(1, "FAIL board synchronous reset state");
    $display("PASS 10_board: HALF_PERIOD=4 and HALF_PERIOD=1 boundary checked");
    $finish;
  end
endmodule
