`timescale 1ns/1ps

module shift_demo(input clk,rst,load,en,serial_in,input [7:0] parallel_in,
 output reg [7:0] q,output serial_out,output reg [3:0] ones);
 integer i;
 assign serial_out=q[7];
 always @*begin ones=0;for(i=0;i<8;i=i+1)ones=ones+q[i];end
 always @(posedge clk)begin
  if(rst)q<=0;
  else if(load)q<=parallel_in;
  else if(en)q<={q[6:0],serial_in};
 end
endmodule
