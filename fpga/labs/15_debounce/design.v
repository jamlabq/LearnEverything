`timescale 1ns/1ps

module debounce_demo(input clk,rst,raw,output reg meta,sync,stable,press,
 output reg [1:0] bounce_count);
 // Two flip-flops reduce real-world metastability risk. A digital simulation
 // models their sampling delay, not the analog probability of metastability.
 always @(posedge clk)begin
  if(rst)begin meta<=0;sync<=0;stable<=0;press<=0;bounce_count<=0;end
  else begin
   meta<=raw;sync<=meta;press<=0;
   if(sync==stable)bounce_count<=0;
   else if(bounce_count==2)begin stable<=sync;press<=sync;bounce_count<=0;end
   else bounce_count<=bounce_count+1'b1;
  end
 end
endmodule
