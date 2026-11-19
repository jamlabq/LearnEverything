# 批量检查十个教学工程；launch_simulation 已按 runtime=all 运行至 $finish。
set validation_root [file normalize [file join [file dirname [info script]] ..]]
foreach selected_lab {01_parallel 02_gates 03_mux 04_adder 05_register 06_counter 07_pipeline 08_fsm 09_pwm 10_board} {
  set argv [list $selected_lab]
  source [file join $validation_root scripts create_project.tcl]
  launch_simulation -simset sim_1 -mode behavioral
  close_sim
  synth_design -rtl -name rtl_1
  puts "PROJECT_CHECK_PASS $selected_lab: [llength [get_cells]] cells, [llength [get_ports]] ports"
  close_design
  close_project
}
