`timescale 1ns/1ps
module fsm_demo (
    input  wire clk,
    input  wire rst,
    input  wire tick,
    output reg  [1:0] state,
    output wire red,
    output wire green,
    output wire yellow
);
    localparam RED = 2'd0, GREEN = 2'd1, YELLOW = 2'd2;
    // 教学简化模型：每个 tick 前进一个状态。
    always @(posedge clk) begin
        if (rst)
            state <= RED;
        else begin
            case (state)
                RED:    if (tick) state <= GREEN;
                GREEN:  if (tick) state <= YELLOW;
                YELLOW: if (tick) state <= RED;
                default: state <= RED;
            endcase
        end
    end
    assign red = (state == RED);
    assign green = (state == GREEN);
    assign yellow = (state == YELLOW);
endmodule
