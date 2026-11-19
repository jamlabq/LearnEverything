`timescale 1ns/1ps
module board_demo #(
    parameter integer HALF_PERIOD = 4
) (
    input  wire clk,
    input  wire rst,
    output reg  led
);
    // HALF_PERIOD=1 时仍保留合法的 1 位寄存器。
    localparam integer WIDTH = (HALF_PERIOD > 1) ? $clog2(HALF_PERIOD) : 1;
    reg [WIDTH-1:0] count;
    always @(posedge clk) begin
        if (rst) begin
            count <= 0;
            led <= 1'b0;
        end else if (count == HALF_PERIOD - 1) begin
            count <= 0;
            led <= ~led;
        end else begin
            count <= count + 1'b1;
        end
    end
endmodule
