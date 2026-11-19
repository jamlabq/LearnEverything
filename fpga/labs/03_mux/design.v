`timescale 1ns/1ps
module mux_demo (
    input  wire a,
    input  wire b,
    input  wire sel,
    output wire y
);
    // sel 为 1 选 b，为 0 选 a。
    assign y = sel ? b : a;
endmodule
