`timescale 1ns/1ps
// 三条连续赋值描述三条并行工作的逻辑支路。
module parallel_demo (
    input  wire a,
    input  wire b,
    output wire y_and,
    output wire y_xor,
    output wire y_not
);
    assign y_and = a & b;
    assign y_xor = a ^ b;
    assign y_not = ~a;
endmodule
