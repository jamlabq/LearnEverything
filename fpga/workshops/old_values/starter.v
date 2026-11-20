`timescale 1ns/1ps
module old_values(input clk,rst,output reg [3:0] a,b);
 always @(posedge clk)begin
  if(rst)begin a<=4'd1;b<=4'd2;end
  else begin
   // Exercise: replace the two holds with a simultaneous exchange.
   a<=a;
   b<=b;
  end
 end
endmodule
