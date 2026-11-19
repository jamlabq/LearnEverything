`timescale 1ns/1ps

module tb;
 reg clk=0;always #5 clk=~clk;reg rst=1,raw=0;
 wire meta,sync,stable,press;wire [1:0] bounce_count;
 reg expected_meta=0,expected_sync=0,expected_stable=0,expected_press=0;
 integer expected_count=0,i,presses=0;
 debounce_demo dut(.*);
 task cycle(input bit r,v);
 begin @(negedge clk);rst=r;raw=v;
 expected_press=0;
 if(r)begin expected_meta=0;expected_sync=0;expected_stable=0;expected_count=0;end
 else begin
 if(expected_sync==expected_stable)expected_count=0;
 else if(expected_count==2)begin expected_stable=expected_sync;expected_press=expected_sync;expected_count=0;end
 else expected_count=expected_count+1;
 expected_sync=expected_meta;expected_meta=v;
 end
 @(posedge clk);#1;
 if({meta,sync,stable,press,bounce_count}!=={expected_meta,expected_sync,expected_stable,expected_press,expected_count[1:0]}) $fatal(1,"two synchronizers and exactly three different samples");
 if(press)presses=presses+1;
 end endtask
 initial begin
 cycle(1,0);cycle(0,1);cycle(0,0);cycle(0,1);cycle(0,0);
 for(i=0;i<9;i=i+1)cycle(0,1);
 for(i=0;i<3;i=i+1)cycle(0,0);cycle(0,1);cycle(0,0);
 for(i=0;i<10;i=i+1)cycle(0,0);
 if(presses!=1 || stable!==0) $fatal(1,"one rising press, debounced release");
 cycle(1,1);$display("PASS 15_debounce: synchronization latency, bounce threshold, one-cycle press, release");$finish;
 end
endmodule
