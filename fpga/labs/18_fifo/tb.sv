`timescale 1ns/1ps

module tb;
 reg clk=0;always #5 clk=~clk;reg rst=1,push=0,pop=0;reg [7:0] din=0;
 wire [7:0] head,dout;wire [2:0] count;wire full,empty,accepted_push,accepted_pop;wire [1:0] wptr,rptr;
 reg [7:0] expected_queue[0:4095];reg [7:0] expected_dout=0;
 integer expected_read=0,expected_write=0,expected_count=0,i,seed=32'h5A17;
 reg previous_push,previous_pop;
 fifo_demo dut(.*);
 task cycle(input bit r,p,u,input [7:0] value);
 begin @(negedge clk);rst=r;push=p;pop=u;din=value;#1;
 previous_pop=u&&(expected_count>0)&&!r;previous_push=p&&((expected_count<4)||previous_pop)&&!r;
 if(accepted_push!==previous_push || accepted_pop!==previous_pop)$fatal(1,"FIFO acceptance at count=%d",expected_count);
 if(r)begin expected_read=0;expected_write=0;expected_count=0;expected_dout=0;end
 else begin
 if(previous_pop)begin expected_dout=expected_queue[expected_read];expected_read=expected_read+1;end
 if(previous_push)begin expected_queue[expected_write]=value;expected_write=expected_write+1;end
 expected_count=expected_count+previous_push-previous_pop;
 end
 @(posedge clk);#1;
 if(count!==expected_count || full!==(expected_count==4) || empty!==(expected_count==0) || dout!==expected_dout || wptr!==(expected_write%4) || rptr!==(expected_read%4))$fatal(1,"FIFO scoreboard count/pointer/data");
 if(expected_count==0)begin if(head!==0)$fatal(1,"empty head must be zero");end
 else if(head!==expected_queue[expected_read])$fatal(1,"FIFO head order");
 end endtask
 initial begin
 cycle(1,1,1,8'hFF);cycle(0,0,1,0);cycle(0,1,1,8'hA0);
 cycle(0,1,0,8'hB1);cycle(0,1,0,8'hC2);cycle(0,1,0,8'hD3);
 cycle(0,1,0,8'hEE);cycle(0,1,1,8'hE4);
 for(i=0;i<4;i=i+1)cycle(0,0,1,0);
 cycle(0,1,1,8'h71);
 for(i=0;i<600;i=i+1)begin seed=(seed*1103515245+12345);cycle(0,(seed>>8)&1,(seed>>16)&1,seed>>20);end
 for(i=0;i<5;i=i+1)cycle(0,0,1,0);
 cycle(1,1,1,55);
 $display("PASS 18_fifo: scoreboard 600 random cycles, full replace, empty push/pop, wrap, reset");$finish;
 end
endmodule
