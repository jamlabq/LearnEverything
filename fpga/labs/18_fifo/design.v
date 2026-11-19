`timescale 1ns/1ps

module fifo_demo(input clk,rst,push,pop,input [7:0] din,
 output [7:0] head,output reg [7:0] dout,output reg [2:0] count,
 output full,empty,accepted_push,accepted_pop,output reg [1:0] wptr,rptr);
 reg [7:0] mem[0:3];
 assign empty=(count==0);assign full=(count==4);
 assign head=empty?8'd0:mem[rptr];
 assign accepted_pop=pop&&!empty&&!rst;
 assign accepted_push=push&&(!full||accepted_pop)&&!rst;
 always @(posedge clk)begin
  if(rst)begin count<=0;wptr<=0;rptr<=0;dout<=0;end
  else begin
   if(accepted_pop)begin dout<=head;rptr<=rptr+1'b1;end
   if(accepted_push)begin mem[wptr]<=din;wptr<=wptr+1'b1;end
   case({accepted_push,accepted_pop})
    2'b10:count<=count+1'b1;
    2'b01:count<=count-1'b1;
    default:count<=count;
   endcase
  end
 end
endmodule
