`timescale 1ns/1ps
module adder_demo (
    input  wire [3:0] a,
    input  wire [3:0] b,
    output wire [4:0] sum,
    output wire [3:0] low_sum,
    output wire carry
);
    // 先扩展到 5 位，再相加；最高位保留进位。
    assign sum = {1'b0, a} + {1'b0, b};
    assign low_sum = sum[3:0];
    assign carry = sum[4];
endmodule
