`timescale 1ns/1ps

module tb;
 reg clk=0; always #5 clk=~clk;
 reg rst=1,load=0,add_en=0,sub_en=0; reg [7:0] d=0;
 wire [7:0] q; wire ge10;
 variables_demo dut(.*);
 task step(input bit r,l,a,s,input [7:0] value,input [7:0] expected_q);
 begin @(negedge clk); rst=r;load=l;add_en=a;sub_en=s;d=value;
 @(posedge clk);#1;
 if(q!==expected_q || ge10!==(expected_q>=10)) $fatal(1,"priority/wrap: q=%d expected=%d",q,expected_q);
 end endtask
 initial begin
 step(1,1,1,1,99,0); step(0,1,1,1,9,9);step(0,0,1,1,0,10);
 step(0,0,0,1,0,9);step(0,0,0,0,0,9);step(0,1,0,0,255,255);
 step(0,0,1,0,0,0);step(0,0,0,1,0,255);step(1,1,1,1,77,0);
 $display("PASS 11_variables: reset, load/add/sub priority, hold, wrap, comparator");$finish;
 end
endmodule
