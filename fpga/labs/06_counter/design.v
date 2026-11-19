`timescale 1ns/1ps
module counter_demo (
    input  wire clk,
    input  wire rst,
    input  wire en,
    output reg  [3:0] count,
    output reg  wrap
);
    always @(posedge clk) begin
        if (rst) begin
            count <= 4'd0;
            wrap <= 1'b0;
        end else begin
            // 每拍先清零，仅在使能且旧计数为 15 时产生脉冲。
            wrap <= 1'b0;
            if (en) begin
                count <= count + 4'd1;
                wrap <= (count == 4'd15);
            end
        end
    end
endmodule
