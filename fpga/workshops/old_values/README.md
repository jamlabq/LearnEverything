# 两行赋值，两个寄存器

先在实验 05 的互动对照里预测初值 a=1、b=2。C/Java 顺序执行 `a=b; b=a;` 得到 2/2；时钟过程使用 `a<=b; b<=a;`，同一上升沿得到 2/1，下个上升沿回到 1/2。

1. 从实验包根目录执行 `bash scripts/run_workshops.sh old_values`。完整参考版应打印 PASS。
2. 打开 `workshops/old_values/starter.v`。当前两行都保持自己，测试失败是预期现象。
3. 只修改两行右侧，使 A 接旧 B、B 接旧 A。保留 `<=` 和复位分支。
4. 执行 `bash scripts/run_workshops.sh old_values --starter`。全部检查通过才算完成。
5. 独立练习：增加 EN，只在 EN=1 时交换；测试连续交换、暂停两拍和复位优先。预期暂停期间 A/B 保持。

这两份 .v 是二选一编译，不能同时加入工程（模块名相同）。`tb.sv` 提供时钟、复位、预期结果和超时；设计没有 `#` 延时。

查看参考版波形：加载 Vivado settings64.sh 后，执行 `cd build/workshop_old_values`，再运行 `xsim workshop_sim.wdb -gui`。参考版固定用复位装入 1、2；网页可修改初值以帮助预测。
