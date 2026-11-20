`timescale 1ns/1ps
module tb;
 reg clk=0,rst=1,raw=0;always #5 clk=~clk;
 wire meta,sync,previous,stable,press;wire [1:0] bounce_count;
 wire [3:0] level_count,edge_count,clean_count;
 button_counter dut(.*);
 task drive(input bit value,input integer clocks);integer i;begin
 for(i=0;i<clocks;i=i+1)begin
 @(negedge clk);raw=value;@(posedge clk);#1;
 end
 end endtask
 task reset;begin
 @(negedge clk);rst=1;@(posedge clk);#1;
 if(level_count!==0 || edge_count!==0 || clean_count!==0 || press!==0 || stable!==0)$fatal(1,"reset");
 @(negedge clk);rst=0;raw=0;
 end endtask
 task counts(input [3:0] l,e,c);begin
 if(level_count!==l || edge_count!==e || clean_count!==c)
 $fatal(1,"counts got=%0d/%0d/%0d expected=%0d/%0d/%0d",level_count,edge_count,clean_count,l,e,c);
 end endtask
 initial begin
 reset();drive(1,12);drive(0,12);counts(12,1,1);
 if(stable!==0 || press!==0)$fatal(1,"release must not press");
 reset();drive(1,1);drive(0,1);drive(1,1);drive(0,1);drive(1,12);drive(0,12);counts(14,3,1);
 reset();drive(1,2);drive(0,10);counts(2,1,0);
 reset();drive(1,4);reset();drive(0,8);counts(0,0,0);
 $display("PASS button_counter: held level, bouncing edges, single press, short pulse, reset");$finish;
 end
 initial begin #10000;$fatal(1,"watchdog");end
endmodule
