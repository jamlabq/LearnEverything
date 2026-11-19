`timescale 1ns/1ps
module tb;
  reg clk = 0, rst = 1, tick = 0;
  wire [1:0] state;
  wire red, green, yellow;
  fsm_demo dut(.clk(clk), .rst(rst), .tick(tick), .state(state), .red(red), .green(green), .yellow(yellow));
  always #5 clk = ~clk;
  task step;
    begin @(posedge clk); #1; end
  endtask
  task check_state(input integer expected);
    begin
      if (state !== expected[1:0] || red !== (expected == 0) ||
          green !== (expected == 1) || yellow !== (expected == 2))
        $fatal(1, "FAIL fsm expected=%0d state=%0d lamps=%b%b%b", expected, state, red, green, yellow);
    end
  endtask
  integer i;
  initial begin
    step(); check_state(0);
    rst = 0;
    step(); check_state(0);
    for (i = 1; i <= 9; i = i + 1) begin
      tick = 1;
      step(); check_state(i % 3);
      tick = 0;
      step(); check_state(i % 3);
    end
    tick = 1;
    step(); check_state(1);
    rst = 1;
    #2; check_state(1);
    step(); check_state(0);
    rst = 0;
    // 仿真故障注入：非法编码在下一上升沿恢复，与 tick 无关。
    for (i = 0; i <= 1; i = i + 1) begin
      tick = i;
      force dut.state = 2'b11;
      #1;
      release dut.state;
      step(); check_state(0);
    end
    $display("PASS 08_fsm: cycle, hold, decoded lights, reset and illegal-state recovery checked");
    $finish;
  end
endmodule
