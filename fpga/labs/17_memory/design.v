`timescale 1ns/1ps

module memory_demo(input clk,rst,we,re,input [1:0] addr,input [7:0] wdata,
 output reg [7:0] rdata,output reg rvalid);
 reg [7:0] mem[0:3];
 // Deliberately no initialization/reset on mem: unwritten words remain X.
 // Both RHS values are old values, so a read/write collision is read-first.
 always @(posedge clk)begin
  if(rst)begin rdata<=0;rvalid<=0;end
  else begin
   if(we)mem[addr]<=wdata;
   if(re)rdata<=mem[addr];
   rvalid<=re;
  end
 end
endmodule
