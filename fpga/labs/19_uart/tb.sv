`timescale 1ns/1ps

module tb;
 reg clk=0;always #5 clk=~clk;reg rst=1,start=0;reg [7:0] data=0;
 wire tx,busy,done;wire [3:0] bit_index;wire [1:0] baud_count;wire [9:0] frame;
 reg start2=0;reg [7:0] data2=0;wire tx2,busy2,done2;wire [3:0] index2;wire [0:0] baud2;wire [9:0] frame2;
 uart_demo dut(.*);
 uart_demo #(.CLKS_PER_BIT(2)) fast(.clk(clk),.rst(rst),.start(start2),.data(data2),.tx(tx2),.busy(busy2),.done(done2),.bit_index(index2),.baud_count(baud2),.frame(frame2));
 integer k,j;reg [9:0] expected_frame;
 integer expected_sent=0,expected_decoded=0;
 reg [7:0] expected_bytes[0:7],previous_decoded;integer previous_bit;
 // Parallel receiver: only TX determines start, bit values and sampling times.
 // This monitor does not use DUT frame, bit_index, baud_count, busy or done.
 initial forever begin
 @(negedge tx);
 if(!rst)begin
 fork : receive_or_reset
 begin : decode_frame
 #20;if(rst)disable decode_frame;
 if(tx!==0)$fatal(1,"wire decoder: short start bit");
 previous_decoded=0;
 for(previous_bit=0;previous_bit<8;previous_bit=previous_bit+1)begin
 #40;if(rst)disable decode_frame;previous_decoded[previous_bit]=tx;
 end
 #40;if(rst)disable decode_frame;
 if(tx!==1)$fatal(1,"wire decoder: bad stop bit");
 if(expected_decoded>=expected_sent || previous_decoded!==expected_bytes[expected_decoded])
 $fatal(1,"wire decoder: byte %0d got=%h expected=%h",expected_decoded,previous_decoded,expected_bytes[expected_decoded]);
 expected_decoded=expected_decoded+1;
 end
 begin do @(posedge clk); while(!rst); end
 join_any
 disable receive_or_reset;
 end
 end
 always @(posedge clk)begin
 if(rst)begin expected_sent=0;expected_decoded=0;end
 end
 task send_check(input [7:0] value);
 begin
 @(negedge clk);expected_bytes[expected_sent]=value;expected_sent=expected_sent+1;
 start=1;data=value;expected_frame={1'b1,value,1'b0};
 @(posedge clk);#1;
 for(k=0;k<40;k=k+1)begin
 if(busy!==1 || done!==0 || tx!==expected_frame[k/4] || bit_index!==(k/4) || baud_count!==(k%4) || frame!==expected_frame)$fatal(1,"UART symbol/period cycle=%d",k);
 @(negedge clk);start=1;data=~value;
 @(posedge clk);#1;
 end
 if(busy!==0 || done!==1 || tx!==1)$fatal(1,"UART exactly 40 clocks");
 @(negedge clk);start=0;@(posedge clk);#1;if(done!==0 || busy!==0)$fatal(1,"done pulse");
 end endtask
 initial begin
 @(posedge clk);#1;if(tx!==1 || busy!==0 || done!==0)$fatal(1,"reset");
 @(negedge clk);rst=0;
 send_check(0);send_check(8'hA5);send_check(8'h96);send_check(255);
 if(expected_decoded!=4)$fatal(1,"wire decoder: missing completed bytes");
 @(negedge clk);start2=1;data2=8'h53;@(posedge clk);#1;
 for(j=0;j<20;j=j+1)begin
 if(tx2!==({1'b1,8'h53,1'b0}>> (j/2)&1) || busy2!==1 || index2!==(j/2) || baud2!==(j%2))$fatal(1,"parameter 2 cycle=%d",j);
 @(negedge clk);start2=0;@(posedge clk);#1;
 end
 if(busy2!==0 || done2!==1)$fatal(1,"parameter2 duration");
 @(negedge clk);start=1;data=8'h81;@(posedge clk);#1;
 repeat(7)@(negedge clk);rst=1;@(posedge clk);#1;
 if(tx!==1 || busy!==0 || done!==0)$fatal(1,"reset abort");
 @(negedge clk);start=0;rst=0;
 send_check(8'h96);
 if(expected_sent!=1 || expected_decoded!=1)$fatal(1,"wire decoder: post-reset accounting");
 $display("PASS 19_uart: independent TX wire decoder, cycle checks, 00/A5/96/FF, CPB2, reset recovery");$finish;
 end
 initial begin #10000;$fatal(1,"global UART watchdog");end
endmodule
