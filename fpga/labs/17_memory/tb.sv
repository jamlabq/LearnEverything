`timescale 1ns/1ps

module tb;
 reg clk=0;always #5 clk=~clk;reg rst=1,we=0,re=0;reg [1:0] addr=0;reg [7:0] wdata=0;
 wire [7:0] rdata;wire rvalid;wire [7:0] m0=dut.mem[0],m1=dut.mem[1],m2=dut.mem[2],m3=dut.mem[3];
 memory_demo dut(.*);
 task cycle(input bit r,w,read_en,input [1:0] address,input [7:0] value,input [7:0] expected_data,input bit expected_valid);
 begin @(negedge clk);rst=r;we=w;re=read_en;addr=address;wdata=value;
 @(posedge clk);#1;if(rdata!==expected_data || rvalid!==expected_valid)$fatal(1,"RAM addr=%d read-first/reset/hold got=%h expected=%h",addr,rdata,expected_data);
 end endtask
 initial begin
 cycle(1,1,1,0,99,0,0);cycle(0,0,1,0,0,8'hxx,1);
 cycle(0,1,0,0,8'hA5,8'hxx,0);cycle(0,0,1,0,0,8'hA5,1);
 cycle(0,1,1,0,8'h3C,8'hA5,1);cycle(0,0,1,0,0,8'h3C,1);
 cycle(0,1,0,1,8'h11,8'h3C,0);cycle(0,1,0,2,8'h22,8'h3C,0);cycle(0,1,0,3,8'h33,8'h3C,0);
 cycle(1,1,1,0,0,0,0);cycle(0,0,1,0,0,8'h3C,1);
 cycle(0,0,1,1,0,8'h11,1);cycle(0,0,1,2,0,8'h22,1);cycle(0,0,1,3,0,8'h33,1);
 if({m0,m1,m2,m3}!==32'h3C112233)$fatal(1,"memory content retention");
 $display("PASS 17_memory: initial unknown, read-first collision, read hold, reset retains all words");$finish;
 end
endmodule
