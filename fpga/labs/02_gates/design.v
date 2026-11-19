`timescale 1ns/1ps
module gates_demo (
    input  wire a,
    input  wire b,
    output wire y_and,
    output wire y_or,
    output wire y_xor,
    output wire y_not
);
    assign y_and = a & b; // 与：两个都是 1 才输出 1
    assign y_or  = a | b; // 或：至少一个是 1 就输出 1
    assign y_xor = a ^ b; // 异或：两个不相同才输出 1
    assign y_not = ~a;    // 非：把 A 反过来，与 B 无关
endmodule
