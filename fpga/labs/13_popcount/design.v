`timescale 1ns/1ps

module popcount_demo(input clk,rst,start,input [7:0] data,
 output reg [3:0] parallel_count,output reg busy,done,
 output reg [3:0] result,output reg [7:0] work,
 output reg [3:0] partial,steps);
 integer i;
 always @* begin
  parallel_count=0;
  // Synthesis expands eight adders; this loop consumes no clock cycles.
  for(i=0;i<8;i=i+1)parallel_count=parallel_count+data[i];
 end
 always @(posedge clk) begin
  if(rst)begin busy<=0;done<=0;result<=0;work<=0;partial<=0;steps<=0;end
  else begin
   done<=0;
   if(busy)begin
    partial<=partial+work[0];work<=work>>1;steps<=steps+1'b1;
    if(steps==7)begin result<=partial+work[0];busy<=0;done<=1;end
   end else if(start)begin busy<=1;work<=data;partial<=0;steps<=0;end
  end
 end
endmodule
