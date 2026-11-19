`timescale 1ns/1ps

module tb;
 reg clk=0;always #5 clk=~clk;reg rst=1,en=0;
 wire [1:0] phase;wire tick;wire [3:0] count;
 integer i,expected_phase=0,expected_count=0;reg previous_tick;
 modules_demo dut(.*);
 task cycle(input bit r,e);
 begin @(negedge clk);rst=r;en=e;#1;
 previous_tick=!r&&e&&(expected_phase==3);
 if(tick!==previous_tick) $fatal(1,"tick must describe old phase before edge");
 if(r) begin expected_phase=0;expected_count=0;end
 else if(e)begin expected_phase=(expected_phase+1)%4;expected_count=(expected_count+previous_tick)%16;end
 @(posedge clk);#1;
 if(phase!==expected_phase || count!==expected_count || tick!==(!rst&&en&&(expected_phase==3))) $fatal(1,"child modules old-tick sampling");
 end endtask
 initial begin
 cycle(1,1);for(i=0;i<86;i=i+1)cycle(0,1);
 cycle(0,0);cycle(0,0);cycle(0,1);cycle(0,0);cycle(0,1);cycle(1,1);
 $display("PASS 14_modules: timer/counter hierarchy, old tick, enable pauses, rollover");$finish;
 end
endmodule
