log_wave -r /*
open_vcd signals.vcd
log_vcd /tb/*
run all
close_vcd
quit
