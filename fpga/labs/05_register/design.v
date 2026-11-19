`timescale 1ns/1ps
module register_demo (
    input  wire clk,
    input  wire rst,
    input  wire en,
    input  wire [3:0] d,
    output reg  [3:0] q
);
    // 同步复位优先于使能；没有赋值的分支保持原值。
    always @(posedge clk) begin
        if (rst)
            q <= 4'd0;
        else if (en)
            q <= d;
    end
endmodule
