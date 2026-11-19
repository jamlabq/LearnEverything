`timescale 1ns/1ps

module modules_demo(input clk,rst,en,output [1:0] phase,output tick,output [3:0] count);
 practice_timer timer(.clk(clk),.rst(rst),.en(en),.phase(phase),.tick(tick));
 practice_counter counter(.clk(clk),.rst(rst),.tick(tick),.count(count));
endmodule
module practice_timer #(parameter PERIOD=4)(input clk,rst,en,
 output reg [$clog2(PERIOD)-1:0] phase,output tick);
 assign tick=!rst&&en&&(phase==PERIOD-1);
 always @(posedge clk)begin
  if(rst)phase<=0;
  else if(en)begin if(phase==PERIOD-1)phase<=0;else phase<=phase+1'b1;end
 end
endmodule
module practice_counter(input clk,rst,tick,output reg [3:0] count);
 // Both children sample the same old tick at the same edge.
 always @(posedge clk)begin if(rst)count<=0;else if(tick)count<=count+1'b1;end
endmodule
