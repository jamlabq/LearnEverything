`timescale 1ns/1ps
module tb;
  reg [3:0] a = 0, b = 0;
  wire [4:0] sum;
  wire [3:0] low_sum;
  wire carry;
  adder_demo dut(.a(a), .b(b), .sum(sum), .low_sum(low_sum), .carry(carry));
  integer ai, bi, expected;
  initial begin
    for (ai = 0; ai < 16; ai = ai + 1) begin
      for (bi = 0; bi < 16; bi = bi + 1) begin
        a = ai; b = bi; expected = ai + bi;
        #10;
        if (sum !== expected[4:0] || low_sum !== expected[3:0] || carry !== expected[4])
          $fatal(1, "FAIL adder a=%0d b=%0d sum=%0d", a, b, sum);
      end
    end
    $display("PASS 04_adder: all 256 input pairs and carry checked");
    $finish;
  end
endmodule
