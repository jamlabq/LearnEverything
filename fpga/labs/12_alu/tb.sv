`timescale 1ns/1ps

module tb;
 reg [7:0] a=0,b=0;reg [2:0] op=0;wire [7:0] y;wire carry,zero;
 integer ai,bi,oi;integer expected_y,expected_c;
 alu_demo dut(.*);
 // Reference uses integer arithmetic; it never reads DUT intermediate values.
 task check_case(input integer operation,left,right,hold_ns);
 begin
 a=left;b=right;op=operation;expected_c=0;
 case(operation)
 0:begin expected_y=(left+right)&255;expected_c=(left+right)>255;end
 1:begin expected_y=(left-right)&255;expected_c=left<right;end
 2:expected_y=left&right;3:expected_y=left|right;4:expected_y=left^right;
 5:begin expected_y=(left*2)&255;expected_c=left>=128;end
 6:begin expected_y=left/2;expected_c=left%2;end
 7:expected_y=left<right;
 endcase
 #(hold_ns);
 if(y!==expected_y[7:0] || carry!==expected_c[0] || zero!==(expected_y==0))
 $fatal(1,"ALU op=%d a=%d b=%d got=%d/%b expected=%d/%b",op,a,b,y,carry,expected_y,expected_c);
 end
 endtask
 initial begin
 // First320ns: all8 operations, four representative cases each,10ns per case.
 // The website exports this real interval; the exhaustive sweep follows in XSim.
 for(oi=0;oi<8;oi=oi+1) begin
 check_case(oi,0,0,10);
 check_case(oi,255,1,10);
 check_case(oi,129,3,10);
 check_case(oi,3,5,10);
 end
 #1;
 for(oi=0;oi<8;oi=oi+1) for(ai=0;ai<256;ai=ai+1) for(bi=0;bi<256;bi=bi+1)
 check_case(oi,ai,bi,1);
 $display("PASS 12_alu: 32 visible cases, all 524288 operand/op combinations, carry, borrow, zero");$finish;
 end
endmodule
