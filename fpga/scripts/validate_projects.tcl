# 批量检查二十个教学工程；launch_simulation 已按 runtime=all 运行至 $finish。
set validation_root [file normalize [file join [file dirname [info script]] ..]]
set validation_labs [lsort [glob -directory [file join $validation_root labs] -tails {[0-9][0-9]_*}]]
if {[llength $argv]} { set validation_labs $argv }
foreach selected_lab $validation_labs {
  set argv [list $selected_lab]
  source [file join $validation_root scripts create_project.tcl]
  launch_simulation -simset sim_1 -mode behavioral
  close_sim
  synth_design -rtl -name rtl_1
  puts "PROJECT_CHECK_PASS $selected_lab: [llength [get_cells]] cells, [llength [get_ports]] ports"
  close_design
  close_project
}
