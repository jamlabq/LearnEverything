`timescale 1ns/1ps
module button_counter(input clk,rst,raw,
 output reg meta,sync,previous,stable,press,
 output reg [1:0] bounce_count,
 output reg [3:0] level_count,edge_count,clean_count);
 // One clock; all consumers read the old neighboring register outputs.
 always @(posedge clk)begin
  if(rst)begin
   meta<=0;sync<=0;previous<=0;stable<=0;press<=0;bounce_count<=0;
   level_count<=0;edge_count<=0;clean_count<=0;
  end else begin
   meta<=raw;sync<=meta;previous<=sync;
   press<=0;
   if(sync==stable)bounce_count<=0;
   else if(bounce_count==2)begin stable<=sync;press<=sync;bounce_count<=0;end
   else bounce_count<=bounce_count+1'b1;
   // Version 1: count every sampled high level.
   if(sync)level_count<=level_count+1'b1;
   // Version 2: count every rising edge, including bouncing edges.
   if(sync&&!previous)edge_count<=edge_count+1'b1;
   // Version 3: count the previously confirmed one-cycle press.
   // Exercise: choose the confirmed event to enable the final counter.
   clean_count<=clean_count;
  end
 end
endmodule
