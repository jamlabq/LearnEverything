`timescale 1ns/1ps
module tb;
  reg a = 0, b = 0;
  wire y_and, y_or, y_xor, y_not;
  gates_demo dut(.a(a), .b(b), .y_and(y_and), .y_or(y_or), .y_xor(y_xor), .y_not(y_not));
  integer i;
  initial begin
    for (i = 0; i < 4; i = i + 1) begin
      {a,b} = i;
      #10;
      // 按真值表检查，!== 也能发现未连接导致的 X/Z。
      case (i)
        0: if ({y_and,y_or,y_xor,y_not} !== 4'b0001) $fatal(1, "FAIL row 00");
        1: if ({y_and,y_or,y_xor,y_not} !== 4'b0111) $fatal(1, "FAIL row 01");
        2: if ({y_and,y_or,y_xor,y_not} !== 4'b0110) $fatal(1, "FAIL row 10");
        3: if ({y_and,y_or,y_xor,y_not} !== 4'b1100) $fatal(1, "FAIL row 11");
      endcase
    end
    $display("PASS 02_gates: all 4 truth-table rows checked");
    $finish;
  end
endmodule
