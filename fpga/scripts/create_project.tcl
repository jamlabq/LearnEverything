# 从项目根目录运行：vivado -mode gui -source scripts/create_project.tcl -tclargs 01_parallel
set root [file normalize [file join [file dirname [info script]] ..]]
set lab [lindex $argv 0]
switch -- $lab {
    01_parallel { set top parallel_demo }
    02_gates { set top gates_demo }
    03_mux { set top mux_demo }
    04_adder { set top adder_demo }
    05_register { set top register_demo }
    06_counter { set top counter_demo }
    07_pipeline { set top pipeline_demo }
    08_fsm { set top fsm_demo }
    09_pwm { set top pwm_demo }
    10_board { set top board_demo }
    11_variables { set top variables_demo }
    12_alu { set top alu_demo }
    13_popcount { set top popcount_demo }
    14_modules { set top modules_demo }
    15_debounce { set top debounce_demo }
    16_shift { set top shift_demo }
    17_memory { set top memory_demo }
    18_fifo { set top fifo_demo }
    19_uart { set top uart_demo }
    20_project { set top project_demo }
    default { error "实验名称必须是 01_parallel 到 20_project 的课程目录名" }
}
set parts [get_parts -quiet xc7a35tcpg236-1]
if {[info exists ::env(PART)]} {
    set parts [get_parts -quiet $::env(PART)]
} elseif {[llength $parts] == 0} {
    set parts [get_parts -quiet]
}
if {[llength $parts] == 0} { error "找不到已安装器件。请安装 Vivado 器件支持，或设置 PART。" }
set selected_part [lindex $parts 0]
set destination [file join $root build vivado_$lab]
if {[file exists [file join $destination tutorial.xpr]]} {
    open_project [file join $destination tutorial.xpr]
    if {[info exists ::env(PART)] && [get_property PART [current_project]] ne $selected_part} {
        set_property PART $selected_part [current_project]
    }
} else {
    create_project tutorial $destination -part $selected_part
    add_files -norecurse [file join $root labs $lab design.v]
    add_files -fileset sim_1 -norecurse [file join $root labs $lab tb.sv]
}
puts "工程实际目标器件：[get_property PART [current_project]]（请与真实开发板核对）"
set_property top $top [get_filesets sources_1]
set_property top tb [get_filesets sim_1]
set_property xsim.simulate.runtime all [get_filesets sim_1]
update_compile_order -fileset sources_1
update_compile_order -fileset sim_1
puts "已打开 $lab；可运行 Behavioral Simulation，或 Open Elaborated Design 查看电路。"
