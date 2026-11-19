#!/usr/bin/env bash
set -euo pipefail
TASK_ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
TASK_VIVADO_SETTINGS="${VIVADO_SETTINGS:-/opt/Xilinx/Vivado/2022.2/settings64.sh}"
if ! command -v xvlog >/dev/null; then
  if [[ ! -f "$TASK_VIVADO_SETTINGS" ]]; then
    echo "找不到 Vivado，请设置 VIVADO_SETTINGS 为 settings64.sh 的路径。" >&2
    exit 1
  fi
  set +u
  source "$TASK_VIVADO_SETTINGS"
  set -u
fi
TASK_ALL_LABS=()
for TASK_FOLDER in "$TASK_ROOT"/labs/[0-9][0-9]_*; do
  [[ -d "$TASK_FOLDER" && -f "$TASK_FOLDER/design.v" && -f "$TASK_FOLDER/tb.sv" ]] && TASK_ALL_LABS+=("${TASK_FOLDER##*/}")
done
TASK_LABS=()
if [[ "${1:-all}" == all ]]; then
  TASK_LABS=("${TASK_ALL_LABS[@]}")
else
  for TASK_NAME in "${TASK_ALL_LABS[@]}"; do
    [[ "$TASK_NAME" == "$1" ]] && TASK_LABS=("$1")
  done
  if [[ ${#TASK_LABS[@]} -eq 0 ]]; then
    echo "用法: bash scripts/run_labs.sh [all|labs 下的课程目录名]" >&2
    exit 2
  fi
fi
for TASK_LAB in "${TASK_LABS[@]}"; do
  mkdir -p "$TASK_ROOT/build/$TASK_LAB"
  cd "$TASK_ROOT/build/$TASK_LAB"
  xvlog --sv "$TASK_ROOT/labs/$TASK_LAB/design.v" "$TASK_ROOT/labs/$TASK_LAB/tb.sv" 2>&1 | tee compile.log
  xelab tb -debug typical -s tutorial_sim 2>&1 | tee elaborate.log
  xsim tutorial_sim -tclbatch "$TASK_ROOT/scripts/waves.tcl" 2>&1 | tee simulate.log
  if grep -Ei '(^|[[:space:]])(ERROR:|FATAL:|FAIL )' compile.log elaborate.log simulate.log || ! grep -Fq "PASS $TASK_LAB:" simulate.log; then
    echo "实验失败：$TASK_LAB，请查看 build/$TASK_LAB/ 下的日志。" >&2
    exit 1
  fi
  test -s signals.vcd
  echo "已验证 $TASK_LAB → build/$TASK_LAB/signals.vcd"
done
