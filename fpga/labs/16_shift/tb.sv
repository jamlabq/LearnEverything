`timescale 1ns/1ps

module tb;
 reg clk=0;always #5 clk=~clk;reg rst=1,load=0,en=0,serial_in=0;reg [7:0] parallel_in=0;
 wire [7:0] q;wire serial_out;wire [3:0] ones;
 integer i,k,expected_ones;reg [7:0] expected_q=0,previous_shifted=0;
 shift_demo dut(.*);
 task cycle(input bit r,l,e,s,input [7:0] p);
 begin @(negedge clk);rst=r;load=l;en=e;serial_in=s;parallel_in=p;#1;
 if(serial_out!==expected_q[7])$fatal(1,"serial output before edge");
 previous_shifted={previous_shifted[6:0],serial_out};
 if(r)expected_q=0;else if(l)expected_q=p;else if(e)expected_q={expected_q[6:0],s};
 expected_ones=0;for(k=0;k<8;k=k+1)expected_ones=expected_ones+expected_q[k];
 @(posedge clk);#1;if(q!==expected_q || serial_out!==expected_q[7] || ones!==expected_ones)$fatal(1,"shift/load/ones");
 end endtask
 initial begin
 cycle(1,1,1,1,255);cycle(0,1,1,0,8'hA5);previous_shifted=0;
 for(i=0;i<8;i=i+1)cycle(0,0,1,0,0);
 if(previous_shifted!==8'hA5)$fatal(1,"old-MSB serial stream");
 for(i=7;i>=0;i=i-1)cycle(0,0,1,(8'hD3>>i)&1,0);
 if(q!==8'hD3)$fatal(1,"MSB-first reconstruction");
 cycle(0,0,0,1,255);cycle(0,1,1,0,8'h7E);cycle(1,1,1,1,255);
 $display("PASS 16_shift: load priority, serial old MSB, byte reconstruction, parallel ones");$finish;
 end
endmodule
