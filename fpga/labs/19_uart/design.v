`timescale 1ns/1ps

module uart_demo #(parameter CLKS_PER_BIT=4,
 parameter BAUD_WIDTH=(CLKS_PER_BIT>1?$clog2(CLKS_PER_BIT):1))(
 input clk,rst,start,input [7:0] data,output tx,output reg busy,done,
 output reg [3:0] bit_index,output reg [BAUD_WIDTH-1:0] baud_count,
 output reg [9:0] frame);
 assign tx=busy?frame[bit_index]:1'b1;
 always @(posedge clk)begin
  if(rst)begin busy<=0;done<=0;bit_index<=0;baud_count<=0;frame<=10'h3FF;end
  else begin
   done<=0;
   if(busy)begin
    if(baud_count==CLKS_PER_BIT-1)begin
     baud_count<=0;
     if(bit_index==9)begin busy<=0;done<=1;end
     else bit_index<=bit_index+1'b1;
    end else baud_count<=baud_count+1'b1;
   end else if(start)begin frame<={1'b1,data,1'b0};busy<=1;bit_index<=0;baud_count<=0;end
  end
 end
endmodule
