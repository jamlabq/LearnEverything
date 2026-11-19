`timescale 1ns/1ps

module tb;
 reg clk=0;always #5 clk=~clk;
 reg rst=1,start=0;reg [7:0] data=0;
 wire [3:0] parallel_count,result,partial,steps;wire [7:0] work;wire busy,done;
 integer value,k,expected_count,expected_partial;reg [7:0] expected_work;
 popcount_demo dut(.*);
 initial begin
 @(posedge clk);#1;if(busy!==0 || done!==0 || result!==0) $fatal(1,"reset");
 for(value=0;value<256;value=value+1) begin
 @(negedge clk);rst=0;start=1;data=value;expected_count=0;
 for(k=0;k<8;k=k+1)expected_count=expected_count+((value>>k)&1);
 #1;if(parallel_count!==expected_count) $fatal(1,"parallel popcount %d",value);
 @(posedge clk);#1;if(busy!==1 || done!==0 || work!==value || partial!==0 || steps!==0) $fatal(1,"snapshot");
 expected_work=value;expected_partial=0;
 for(k=1;k<=8;k=k+1)begin
 @(negedge clk);start=1;data=~value;
 expected_partial=expected_partial+expected_work[0];expected_work=expected_work>>1;
 @(posedge clk);#1;
 if(work!==expected_work || partial!==expected_partial || steps!==k || busy!==(k<8) || done!==(k==8)) $fatal(1,"iterative value=%d step=%d",value,k);
 end
 if(result!==expected_count) $fatal(1,"result value=%d",value);
 @(negedge clk);start=0;@(posedge clk);#1;if(done!==0 || result!==expected_count) $fatal(1,"done pulse/result hold");
 end
 @(negedge clk);start=1;data=255;@(posedge clk);#1;
 @(negedge clk);rst=1;@(posedge clk);#1;if(busy!==0 || done!==0 || result!==0) $fatal(1,"reset abort");
 $display("PASS 13_popcount: all 256 bytes, 8-cycle latency, busy ignores start, reset abort");$finish;
 end
endmodule
