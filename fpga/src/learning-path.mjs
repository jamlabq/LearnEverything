// Stable lesson IDs keep old links and saved progress valid; order is pedagogical.
export const courseStages=[
 {title:'01 · 建立电路直觉',goal:'分清输入、组合运算、存储与时钟。',ids:[1,2,3,4,5],check:'能预测输入改变和时钟到来时，哪些输出会变。'},
 {title:'02 · 迁移编程经验',goal:'把变量、条件、循环和模块变成电路。',ids:[11,6,14,13,7,12],check:'能解释旧值、优先级，以及并行展开与多拍计算的区别。'},
 {title:'03 · 做出一个小系统',goal:'从按键计数走向事件、状态和串行数据。',ids:[15,8,9,16],check:'能把一次按下变成一次计数，并用波形说明为什么。'},
 {title:'04 · 存储与串口项目',goal:'逐块验证接收、排队和发送，最后了解上板。',ids:[17,18,19,20,10],check:'能按接口连接系统、检查顺序和复位，并说明仿真的边界。'}
];
export const learningOrder=courseStages.flatMap(s=>s.ids);
export function neighbors(id){const i=learningOrder.indexOf(id);return {previous:learningOrder[i-1]??null,next:learningOrder[i+1]??null};}
