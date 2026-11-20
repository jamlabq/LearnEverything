#!/usr/bin/env bash
set -euo pipefail
TASK_ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
TASK_SETTINGS="${VIVADO_SETTINGS:-/opt/Xilinx/Vivado/2022.2/settings64.sh}"
if ! command -v xvlog >/dev/null; then
  [[ -f "$TASK_SETTINGS" ]] || { echo "找不到 Vivado，请设置 VIVADO_SETTINGS。" >&2; exit 1; }
  set +u
  source "$TASK_SETTINGS"
  set -u
fi
case "${1:-all}" in
 all) TASK_LABS=(old_values button_counter);;
 old_values|button_counter) TASK_LABS=("$1");;
 *) echo "用法: bash scripts/run_workshops.sh [all|old_values|button_counter] [--starter]" >&2;exit 2;;
esac
TASK_FILE=design.v
case "${2:-}" in '') ;; --starter) TASK_FILE=starter.v;; *) exit 2;; esac
run_stage() {
 local task_log="$1"
 shift
 if ! "$@" > "$task_log" 2>&1; then
  tail -n 30 "$task_log" >&2
  echo "工具执行失败，请检查日志：$PWD/$task_log" >&2
  return 1
 fi
}
for TASK_LAB in "${TASK_LABS[@]}"; do
 TASK_OUTPUT="$TASK_ROOT/build/workshop_$TASK_LAB"
 [[ "$TASK_FILE" == starter.v ]] && TASK_OUTPUT="${TASK_OUTPUT}_starter"
 mkdir -p "$TASK_OUTPUT"
 cd "$TASK_OUTPUT"
 run_stage compile.log xvlog --sv "$TASK_ROOT/workshops/$TASK_LAB/$TASK_FILE" "$TASK_ROOT/workshops/$TASK_LAB/tb.sv"
 run_stage elaborate.log xelab tb -debug typical -s workshop_sim
 run_stage simulate.log xsim workshop_sim -tclbatch "$TASK_ROOT/scripts/waves.tcl"
 if grep -Ei '(^|[[:space:]])(ERROR:|FATAL:|FAIL )' compile.log elaborate.log simulate.log || ! grep -Fq "PASS $TASK_LAB:" simulate.log; then
  echo "实验未通过：$TASK_OUTPUT。starter.v 是待补全练习，原始版本失败是预期现象。" >&2
  exit 1
 fi
 test -s signals.vcd
 grep -F "PASS $TASK_LAB:" simulate.log
 echo "波形：$TASK_OUTPUT/signals.vcd"
done
