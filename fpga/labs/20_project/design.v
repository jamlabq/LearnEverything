`timescale 1ns/1ps

// Standalone buffered 8N1 echo: each child samples the old neighboring signals.
module project_demo #(parameter CLKS_PER_BIT=4)(
 input clk,rst,rx,output tx,tx_busy,rx_valid,output [7:0] rx_data,
 output [2:0] queued,output reg overflow,output framing_error);
 wire [7:0] head,unused_dout;wire empty,full,accepted_push,accepted_pop;
 wire pop=!tx_busy&&!empty;wire unused_done;
 project_uart_rx #(.CLKS_PER_BIT(CLKS_PER_BIT)) receiver(
 .clk(clk),.rst(rst),.rx(rx),.data(rx_data),.valid(rx_valid),.error(framing_error));
 project_fifo queue(.clk(clk),.rst(rst),.push(rx_valid),.pop(pop),.din(rx_data),
 .head(head),.dout(unused_dout),.count(queued),.empty(empty),.full(full),
 .accepted_push(accepted_push),.accepted_pop(accepted_pop));
 project_uart_tx #(.CLKS_PER_BIT(CLKS_PER_BIT)) transmitter(
 .clk(clk),.rst(rst),.start(pop),.data(head),.tx(tx),.busy(tx_busy),.done(unused_done));
 always @(posedge clk)begin
  if(rst)overflow<=0;
  else if(rx_valid&&!accepted_push)overflow<=1;
 end
endmodule

module project_uart_rx #(parameter CLKS_PER_BIT=4,
 parameter TIMER_WIDTH=$clog2(CLKS_PER_BIT))(
 input clk,rst,rx,output reg [7:0] data,output reg valid,error);
 localparam IDLE=2'd0,START=2'd1,DATA=2'd2,STOP=2'd3;
 reg meta,sync;reg [1:0] state;reg [TIMER_WIDTH-1:0] timer;
 reg [2:0] bit_index;reg [7:0] shift;
 always @(posedge clk)begin
  if(rst)begin
   meta<=1;sync<=1;state<=IDLE;timer<=0;bit_index<=0;shift<=0;data<=0;valid<=0;error<=0;
  end else begin
   meta<=rx;sync<=meta;valid<=0;error<=0;
   case(state)
    IDLE:begin timer<=0;if(!sync)state<=START;end
    START:begin
     if(timer==CLKS_PER_BIT/2-1)begin
      timer<=0;
      if(!sync)begin state<=DATA;bit_index<=0;end
      else state<=IDLE;
     end else timer<=timer+1'b1;
    end
    DATA:begin
     if(timer==CLKS_PER_BIT-1)begin
      timer<=0;shift[bit_index]<=sync;
      if(bit_index==7)state<=STOP;else bit_index<=bit_index+1'b1;
     end else timer<=timer+1'b1;
    end
    STOP:begin
     if(timer==CLKS_PER_BIT-1)begin
      timer<=0;state<=IDLE;
      if(sync)begin data<=shift;valid<=1;end else error<=1;
     end else timer<=timer+1'b1;
    end
    default:state<=IDLE;
   endcase
  end
 end
endmodule

module project_fifo(input clk,rst,push,pop,input [7:0] din,
 output [7:0] head,output reg [7:0] dout,output reg [2:0] count,
 output empty,full,accepted_push,accepted_pop);
 reg [7:0] mem[0:3];reg [1:0] wptr,rptr;
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

module project_uart_tx #(parameter CLKS_PER_BIT=4,
 parameter BAUD_WIDTH=$clog2(CLKS_PER_BIT))(
 input clk,rst,start,input [7:0] data,output tx,output reg busy,done);
 reg [3:0] bit_index;reg [BAUD_WIDTH-1:0] baud_count;reg [9:0] frame;
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
