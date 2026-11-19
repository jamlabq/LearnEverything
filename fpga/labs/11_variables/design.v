`timescale 1ns/1ps

// These assignments describe one register with a priority mux at its input.
module variables_demo(input clk,rst,load,add_en,sub_en,input [7:0] d,
 output reg [7:0] q,output ge10);
 assign ge10=(q>=8'd10);
 always @(posedge clk) begin
  if(rst) q<=0;
  else if(load) q<=d;
  else if(add_en) q<=q+8'd1;
  else if(sub_en) q<=q-8'd1;
 end
endmodule
