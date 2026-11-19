`timescale 1ns/1ps
module tb;
  reg clk = 0, rst = 1, breath_en = 0;
  reg [4:0] level = 0;
  wire [3:0] phase;
  wire [4:0] duty;
  wire pwm;
  pwm_demo dut(.clk(clk), .rst(rst), .level(level), .breath_en(breath_en),
               .phase(phase), .duty(duty), .pwm(pwm));
  // 导出实际寄存器，便于课程波形记录，不导出测试循环变量。
  wire [4:0] auto_duty = dut.auto_duty;
  wire up = dut.up;
  always #5 clk = ~clk;
  task step;
    begin @(posedge clk); #1; end
  endtask
  integer setting, sample, high_count, frame, expected;
  initial begin
    step();
    if (phase !== 0 || auto_duty !== 0 || up !== 1 || pwm !== 0)
      $fatal(1, "FAIL pwm reset");
    rst = 0;
    for (setting = 0; setting <= 17; setting = setting + 1) begin
      level = setting;
      expected = setting > 16 ? 16 : setting;
      #1;
      high_count = 0;
      for (sample = 0; sample < 16; sample = sample + 1) begin
        if (phase !== sample[3:0] || duty !== expected[4:0] || pwm !== (sample < expected))
          $fatal(1, "FAIL pwm static level=%0d phase=%0d duty=%0d pwm=%b", setting, phase, duty, pwm);
        if (pwm) high_count = high_count + 1;
        step();
      end
      if (high_count != expected) $fatal(1, "FAIL pwm high clocks level=%0d high=%0d", setting, high_count);
    end
    level = 31;
    #1;
    if (duty !== 16 || pwm !== 1) $fatal(1, "FAIL pwm upper input clamp");
    breath_en = 1;
    #1;
    // 完整三角波：每个自动电平恰好持续一个 16 拍 PWM 周期。
    for (frame = 0; frame <= 32; frame = frame + 1) begin
      expected = frame <= 16 ? frame : 32 - frame;
      high_count = 0;
      for (sample = 0; sample < 16; sample = sample + 1) begin
        if (phase !== sample[3:0] || duty !== expected[4:0] || auto_duty !== expected[4:0] ||
            pwm !== (sample < expected) || up !== (frame < 16 || frame == 32))
          $fatal(1, "FAIL pwm breath frame=%0d phase=%0d duty=%0d up=%b", frame, phase, duty, up);
        if (pwm) high_count = high_count + 1;
        step();
      end
      if (high_count != expected) $fatal(1, "FAIL pwm breath high-count frame=%0d", frame);
    end
    breath_en = 0; level = 16;
    for (sample = 0; sample < 16; sample = sample + 1) step();
    if (auto_duty !== 1 || duty !== 16) $fatal(1, "FAIL pwm manual mode must pause auto duty");
    rst = 1;
    #1;
    if (pwm !== 0) $fatal(1, "FAIL pwm reset must extinguish output immediately");
    step();
    if (phase !== 0 || auto_duty !== 0 || up !== 1 || pwm !== 0)
      $fatal(1, "FAIL pwm reset state");
    $display("PASS 09_pwm: 0..16 duty counts, clamp, full breath cycle, pause and reset checked");
    $finish;
  end
endmodule
