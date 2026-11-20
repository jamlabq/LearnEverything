`timescale 1ns/1ps
module tb;
 reg clk=0,rst=1;always #5 clk=~clk;
 wire [3:0] a,b;
 old_values dut(.*);
 task check(input [3:0] want_a,want_b);begin
 @(posedge clk);#1;
 if(a!==want_a || b!==want_b)$fatal(1,"old values: got %0d/%0d expected %0d/%0d",a,b,want_a,want_b);
 end endtask
 initial begin
 check(1,2);@(negedge clk);rst=0;
 check(2,1);#2;if(a!==2 || b!==1)$fatal(1,"changed without rising edge");
 check(1,2);check(2,1);check(1,2);
 @(negedge clk);rst=1;check(1,2);
 $display("PASS old_values: simultaneous exchange, hold between edges, reset");$finish;
 end
 initial begin #1000;$fatal(1,"watchdog");end
endmodule
