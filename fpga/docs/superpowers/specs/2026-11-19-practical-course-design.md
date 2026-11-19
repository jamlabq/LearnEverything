# FPGA 从概念到独立小项目：第11–20课

用户要求：当前十课例子太简单，增加足够多的例子，真正达到入门。沿用中文零基础、内嵌 SVG、真实 Vivado/XSim，无需开发板。已有GitHub发布与noreply邮箱偏好持续有效。目标是读者能拆分模块、画数据路径、编写时序过程与测试台、根据波形调试，最终完成带缓冲的串口回显系统。

## 教学与界面

保留原课号及锚点。导航分基础1–10、实践11–20；每课四面板，实践篇每课含至少三个递进练习（预测、实现/改需求、故障定位），明确输入输出契约、每拍旧/新值和自检验收。增加CPU概念到硬件映射，不能把for当时间延迟、if当CPU跳转、变量名当存储保证。增加测试台写法、scoreboard、超时、NBA竞态、位宽、锁存器、ready/busy约定。最后给独立毕业任务和可检查标准。

实践交互采用src/practice-logic.mjs纯模型 + src/practice-simulators.js内嵌SVG、数值/位输入、完整周期/半周期、批量周期、输入预置场景、操作说明、状态/存储格、边沿记录。真实波形与教学模型逐事件交叉验证，较长波形可选观察段。纯模型从已复位状态开始(rst=1)，RAM未写位置是未知，不能伪造上电值。

## 确定的HDL契约（全部同步高有效rst；以下更新读取旧状态）

11_variables / variables_demo：clk,rst,load,add_en,sub_en,d[7:0]；q[7:0], ge10。优先级rst>load>add_en>sub_en>hold；加减模256。ge10=(q>=10)组合。
12_alu / alu_demo：纯组合a,b[7:0],op[2:0]；y[7:0],carry,zero。op0加法(9位扩展，carry高位)，1减法(y=(a-b)mod256,carry=1表示借位a<b)，2 AND，3 OR，4 XOR，5逻辑左移A一位(carry=旧A[7])，6逻辑右移A一位(carry=旧A[0])，7无符号a<b输出0/1；其余carry0，zero=(y==0)。组合过程给完整默认值，不推锁存器。
13_popcount / popcount_demo：clk,rst,start,data[7:0]；parallel_count[3:0]组合统计当前data；busy,done,result[3:0]，work[7:0],partial[3:0],steps[3:0]作为输出可观察。空闲start接受data快照，busy1 work=data partial/steps0；忙时忽略start，每拍partial+=旧work[0],work>>=1,steps++；第8个忙边沿result=旧partial+旧work[0],busy0,done1；done每拍默认0，result保持。for组合展开与8拍迭代对比。
14_modules / modules_demo：clk,rst,en；phase[1:0],tick,count[3:0]。design.v内至少2个子模块，timer默认周期4，counter。tick组合=!rst&&en&&phase==3；timer en时phase=(phase+1)mod4，counter上升沿读取旧tick加1。停用保持phase/count且tick0，同步复位清零。说明子模块间仍旧值采样。
15_debounce / debounce_demo：clk,rst,raw；meta,sync,stable,press,bounce_count[1:0]。每拍meta=raw,sync=旧meta；用旧sync处理消抖。若旧sync==stable则bounce_count0；否则旧bounce_count==2时stable=旧sync,press=旧sync,count0；否则count++。press每拍默认0。需要3个连续不同于stable的同步样本。两级同步不能在数字仿真中证明亚稳态消失。
16_shift / shift_demo：clk,rst,load,en,serial_in,parallel_in[7:0]；q[7:0],serial_out,ones[3:0]。rst清q；load优先q=parallel_in；否则en时q={旧q[6:0],serial_in}；serial_out=当前q[7]，ones=当前q中1个数。说明移出的旧MSB应在边沿前读取；连续8次输入MSB-first重建字节。
17_memory / memory_demo：clk,rst,we,re,addr[1:0],wdata[7:0]；rdata[7:0],rvalid。4x8单端口教学RAM，非复位边沿we时mem[addr]<=wdata，re时rdata<=旧mem[addr]；rvalid<=re。rst只清rdata/rvalid，不清mem。读写同地址同拍read-first。初始未写存储=X，rdata已复位0；不承诺这种小数组必映射BRAM。tb用顶层wire m0..m3可导出内容，测试先读未知，再写读，再检验复位保留。
18_fifo / fifo_demo：clk,rst,push,pop,din[7:0]；head[7:0],dout[7:0],count[2:0],full,empty,accepted_push,accepted_pop；wptr,rptr[1:0]可输出。4深度同步FIFO，head=count0?0:mem[rptr]组合；empty/count0 full/count4；accepted_pop=pop&&!empty&&!rst；accepted_push=push&&(!full||accepted_pop)&&!rst（组合，本边沿之前判断）。有效pop时dout<=旧head并rptr++；push时mem[wptr]<=din,wptr++；count按接受情况增减。空队列同时push/pop只接受push；满队列同时pop/push都接受且弹出旧头；rst清指针计数dout，不清mem，head空时确定0。
19_uart / uart_demo：clk,rst,start,data[7:0]；tx,busy,done,bit_index[3:0],baud_count[1:0],frame[9:0]（便于观察）。CLKS_PER_BIT参数默认4，支持>=2（计数器width按参数）。空闲tx1；空闲start接受frame={1'b1,data,1'b0},busy1,index0,baud0；tx=busy?frame[bit_index]:1。忙时忽略start，每4拍index++，到index9完成4拍后busy0 done1；done默认0，frame保持。8N1、LSB-first、接受沿开始起始位共40时钟，结束后空闲高。tb每字节检查10个符号各4拍、多字节、忙时输入、复位中止及参数2边界。
20_project / project_demo：clk,rst,rx；tx,tx_busy,rx_valid,rx_data[7:0],queued[2:0],overflow,framing_error。design.v内自包含独立命名的UART RX、4深FIFO、UART TX子模块，可由相同单文件编译（不要include其他课）。CPB默认4参数>=4，top测试默认4。RX两级同步：meta<=rx,sync<=旧meta；状态IDLE0检测旧sync0进入START1(timer0)；START在旧timer==CPB/2-1时若sync仍0进入DATA2否则回IDLE；DATA每CPB拍在中点采样旧sync到shift[bit]，8位后STOP3；STOP等待CPB拍检查sync，高则data<=shift,valid1，低则error1；再回IDLE。valid/error每拍默认0。top FIFO push=旧rx_valid, pop=!tx_busy&&!empty，TX start=pop,data=旧head，读取条件均同一上升沿旧值。overflow sticky在旧rx_valid && !accepted_push时置1，rst清；framing_error为RX错误脉冲。不要声称可无损承受无限快输入。tb发送至少0x00,0xA5,0xFF连续帧、假起始位、坏停止位、复位中止；输出独立解码及超时检查。必要时输入更多字节证明队列顺序，教读者区别wire协议速度和FIFO容量。

顶层名与目录名固定；design/tb均timescale1ns/1ps，测试台顶层tb。检查点避开NBA，输入避开posedge竞争。实验日志须打印PASS <目录>:。测试台导出信号排除scoreboard临时变量。
