`timescale 1ns/1ps
module tb;
  reg clk = 0, rst = 1, valid_in = 0;
  reg [3:0] a = 0, b = 0;
  wire [4:0] stage_sum;
  wire valid_s1;
  wire [5:0] y;
  wire valid_out;
  pipeline_demo dut(.clk(clk), .rst(rst), .a(a), .b(b), .valid_in(valid_in),
                    .stage_sum(stage_sum), .valid_s1(valid_s1), .y(y), .valid_out(valid_out));
  always #5 clk = ~clk;
  task step;
    begin @(posedge clk); #1; end
  endtask
  reg [4:0] previous_sum = 0;
  reg previous_valid = 0;
  integer i, expected_sum;
  initial begin
    step();
    if (stage_sum !== 0 || y !== 0 || valid_s1 !== 0 || valid_out !== 0)
      $fatal(1, "FAIL pipeline reset");
    rst = 0;
    // 首拍填充、连续满速输入、气泡、排空：数据总是移动，有效位决定是否使用。
    for (i = 0; i < 12; i = i + 1) begin
      a = i + 4; b = 15 - i;
      valid_in = (i < 6 || i == 8);
      expected_sum = a + b;
      // 让连续输入结果不同，避免错误使用新一级值也侥幸通过。
      if (i[0]) begin b = 0; expected_sum = a; end
      step();
      if (stage_sum !== expected_sum[4:0] || valid_s1 !== valid_in ||
          y !== {previous_sum, 1'b0} || valid_out !== previous_valid)
        $fatal(1, "FAIL pipeline cycle=%0d stage=%0d y=%0d valid=%b%b", i, stage_sum, y, valid_s1, valid_out);
      previous_sum = expected_sum;
      previous_valid = valid_in;
    end
    rst = 1; valid_in = 1; a = 15; b = 15;
    step();
    if (stage_sum !== 0 || y !== 0 || valid_s1 !== 0 || valid_out !== 0)
      $fatal(1, "FAIL pipeline reset flush");
    $display("PASS 07_pipeline: previous-stage data, full-rate input, bubbles and flush checked");
    $finish;
  end
endmodule
