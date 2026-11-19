`timescale 1ns/1ps

module tb;
 reg clk=0;always #5 clk=~clk;reg rst=1,rx=1;
 wire tx,tx_busy,rx_valid,overflow,framing_error;wire [7:0] rx_data;wire [2:0] queued;
 project_demo dut(.*);
 // Expose useful hierarchy as ordinary top-level wires in the compact course VCD.
 wire [1:0] rx_state=dut.receiver.state;wire rx_meta=dut.receiver.meta,rx_sync=dut.receiver.sync;
 wire [7:0] fifo_head=dut.queue.head;wire [3:0] tx_bit=dut.transmitter.bit_index;
 integer expected_received=0,expected_transmitted=0,errors=0,i;reg [7:0] expected_bytes[0:31];
 reg [7:0] previous_decoded;integer previous_bit;
 // Decode only the physical TX wire, with a clock-independent baud-period delay.
 initial begin
 forever begin
 @(negedge tx);
 if(!rst)begin
 #20;if(tx!==0)$fatal(1,"TX short start bit");
 previous_decoded=0;
 for(previous_bit=0;previous_bit<8;previous_bit=previous_bit+1)begin #40;previous_decoded[previous_bit]=tx;end
 #40;if(tx!==1)$fatal(1,"TX bad stop bit");
 if(expected_transmitted>=expected_received || previous_decoded!==expected_bytes[expected_transmitted])$fatal(1,"echo order index=%d got=%h expected=%h",expected_transmitted,previous_decoded,expected_bytes[expected_transmitted]);
 expected_transmitted=expected_transmitted+1;
 end
 end
 end
 always @(posedge clk)begin #1;
 if(!rst && rx_valid)begin
 if(rx_data!==expected_bytes[expected_received])$fatal(1,"RX data index=%d got=%h expected=%h",expected_received,rx_data,expected_bytes[expected_received]);
 expected_received=expected_received+1;
 end
 if(!rst && framing_error)errors=errors+1;
 if(!rst && overflow)$fatal(1,"unexpected overflow at supported wire rate");
 end
 task bit_period(input bit value);begin rx=value;repeat(4)@(negedge clk);end endtask
 task send_byte(input [7:0] value,input bit good_stop);integer k;begin
 bit_period(0);for(k=0;k<8;k=k+1)bit_period(value[k]);bit_period(good_stop);
 end endtask
 task drain(input integer target);integer timeout;begin
 timeout=0;
 while(expected_transmitted<target && timeout<1000)begin @(negedge clk);timeout=timeout+1;end
 if(expected_transmitted!=target)$fatal(1,"echo timeout got=%d expected=%d",expected_transmitted,target);
 repeat(12)@(negedge clk);
 if(tx_busy!==0 || queued!==0 || tx!==1)$fatal(1,"drained idle state");
 end endtask
 initial begin
 // Expectations are declared separately from the serial driver and DUT decoder.
 expected_bytes[0]=0;expected_bytes[1]=8'hA5;expected_bytes[2]=255;
 expected_bytes[3]=8'h12;expected_bytes[4]=8'h34;expected_bytes[5]=8'h56;
 expected_bytes[6]=8'h81;expected_bytes[7]=8'h7E;
 repeat(3)@(negedge clk);rst=0;repeat(4)@(negedge clk);
 rx=0;@(negedge clk);rx=1;repeat(10)@(negedge clk);
 if(expected_received!=0 || errors!=0)$fatal(1,"false start accepted");
 send_byte(0,1);send_byte(8'hA5,1);send_byte(255,1);send_byte(8'h12,1);send_byte(8'h34,1);send_byte(8'h56,1);rx=1;
 drain(6);
 send_byte(8'hEE,0);rx=1;repeat(16)@(negedge clk);
 if(errors!=1 || expected_received!=6 || expected_transmitted!=6)$fatal(1,"bad stop must pulse error without echo");
 // Abort a partial input frame; reset must flush FIFO and return TX high.
 bit_period(0);bit_period(1);rst=1;rx=1;repeat(3)@(negedge clk);
 if(tx!==1 || tx_busy!==0 || queued!==0 || overflow!==0 || rx_valid!==0 || framing_error!==0)$fatal(1,"project reset abort");
 rst=0;repeat(6)@(negedge clk);send_byte(8'h81,1);send_byte(8'h7E,1);rx=1;drain(8);
 if(expected_received!=8 || errors!=1)$fatal(1,"receive accounting");
 $display("PASS 20_project: physical independent UART echo decoder, continuous frames, false start, bad stop, reset");$finish;
 end
 initial begin #100000;$fatal(1,"global serial watchdog");end
endmodule
