`timescale 1ns/1ps
module pwm_demo (
    input  wire clk,
    input  wire rst,
    input  wire [4:0] level,
    input  wire breath_en,
    output reg  [3:0] phase,
    output wire [4:0] duty,
    output wire pwm
);
    reg [4:0] auto_duty;
    reg up;
    always @(posedge clk) begin
        if (rst) begin
            phase <= 4'd0;
            auto_duty <= 5'd0;
            up <= 1'b1;
        end else begin
            phase <= phase + 4'd1;
            // 只在一个完整 PWM 周期结束时更新亮度。
            if (phase == 4'd15 && breath_en) begin
                if (up) begin
                    auto_duty <= auto_duty + 5'd1;
                    if (auto_duty == 5'd15) up <= 1'b0;
                end else begin
                    auto_duty <= auto_duty - 5'd1;
                    if (auto_duty == 5'd1) up <= 1'b1;
                end
            end
        end
    end
    assign duty = breath_en ? auto_duty : ((level > 5'd16) ? 5'd16 : level);
    // phase 为 0..15，duty 为 0..16，精确覆盖 0% 和 100%。
    assign pwm = !rst && ({1'b0, phase} < duty);
endmodule
