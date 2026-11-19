`timescale 1ns/1ps

module alu_demo(input [7:0] a,b,input [2:0] op,
 output reg [7:0] y,output reg carry,output zero);
 assign zero=(y==0);
 always @* begin
  // Defaults cover every path; the circuit never needs to remember old y.
  y=0;carry=0;
  case(op)
   3'd0:{carry,y}={1'b0,a}+{1'b0,b};
   3'd1:begin y=a-b;carry=(a<b);end // carry means borrow for subtraction.
   3'd2:y=a&b;
   3'd3:y=a|b;
   3'd4:y=a^b;
   3'd5:begin y={a[6:0],1'b0};carry=a[7];end
   3'd6:begin y={1'b0,a[7:1]};carry=a[0];end
   3'd7:y={7'b0,(a<b)};
  endcase
 end
endmodule
