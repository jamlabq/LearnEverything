`timescale 1ns/1ps
module pipeline_demo (
    input  wire clk,
    input  wire rst,
    input  wire [3:0] a,
    input  wire [3:0] b,
    input  wire valid_in,
    output reg  [4:0] stage_sum,
    output reg  valid_s1,
    output reg  [5:0] y,
    output reg  valid_out
);
    always @(posedge clk) begin
        if (rst) begin
            stage_sum <= 5'd0;
            valid_s1 <= 1'b0;
            y <= 6'd0;
            valid_out <= 1'b0;
        end else begin
            stage_sum <= {1'b0, a} + {1'b0, b};
            valid_s1 <= valid_in;
            // 非阻塞赋值读取旧 stage_sum，拼接保证左移结果有 6 位。
            y <= {stage_sum, 1'b0};
            valid_out <= valid_s1;
        end
    end
endmodule
