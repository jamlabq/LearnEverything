# FPGA review fixes implementation plan

> Implementation branch: `fix/fpga-review`. Keep GitHub noreply author and committer identities when publishing.

**Goal:** Make the twenty-lesson course instructions, independent UART checks and reset acceptance agree with the supplied experiments.

**Architecture:** Preserve the DUT circuits and decimal-only browser controls. Correct the teaching text and strengthen the two serial testbenches, then regenerate real XSim records and the downloadable lab bundle.

**Tech stack:** Static ES modules, embedded SVG, SystemVerilog, Vivado/XSim 2022.2, Node tests and Python Playwright.

## 1. Reset-aware graduation testbench

Files: `fpga/labs/20_project/tb.sv`.

- [x] Add reset-during-TX and queued-data reset stimuli, with bounded waiting and fresh post-reset expected bytes. Confirm the existing monitor fails on the aborted frame (review reproduction: `got=fe expected=00`).
- [x] Cancel an in-flight wire decode when reset is sampled; clear reference receive/transmit counts on the same reset edge. Keep wire sampling independent of DUT state.
- [x] Verify RX, TX and queued-data reset cases, post-reset echo, continuous input, bad stop, and watchdog with `bash scripts/run_labs.sh 20_project`.

## 2. Independent UART decoding and fault observability

Files: `fpga/labs/19_uart/tb.sv`, `fpga/src/content-practice.js`.

- [x] Add a TX-only mid-bit decoder with independent expected bytes, reset cancellation, completion accounting and a global watchdog. Include non-palindromic `8'h96` and a post-reset frame.
- [x] Keep cycle/done assertions for early completion. Change the challenge to explain why idle high can hide early completion on a single frame.
- [x] Run `bash scripts/run_labs.sh 19_uart`. In isolated temporary copies, prove early completion fails timing checks, reversed data bits fail wire decoding, and stuck-high TX fails completed-byte accounting without hanging.

## 3. Teaching corrections

Files: `fpga/src/content-practice.js`, `fpga/src/practice-simulators.js`, `fpga/README.md`.

- [x] Explain `0x12 = 18` and `8'h12`; label decimal controls. Give explicit decimal inputs for interactive hexadecimal examples. Use consistent hexadecimal prefixes in RAM/FIFO tables and expected values.
- [x] Explain N samples span `(N−1)×T`, separate sync latency, and document the reproduced 22 ns pulse / 10 ns period / N=3 example.
- [x] Join the README course table; correct graduation `tb.sv` and the backtick in the timescale directive.
- [x] Manually exercise RAM decimal 18/52, FIFO 17/34/51/68/85 and UART 165 in the browser; compare resulting values with the revised instructions.

## 4. Verify and publish

- [x] Run all twenty XSim labs, then `python3 scripts/export_waves.py` from `fpga/` to regenerate embedded source, VCD data and ZIP.
- [x] Run `node --test fpga/tests/*.test.mjs`, `python3 fpga/tests/export_waves_test.py`, and the practice browser check. Build Pages with `python3 scripts/build_pages.py`.
- [ ] Commit the reviewed diff with noreply author and committer, fast-forward main and push to the existing origin.
- [ ] Confirm GitHub Actions deployment and fetch the published updated content. Report actual checks and URL.

## Validation recorded before publication

- All 20 XSim 2022.2 labs pass; 42 Node tests pass against newly exported waveforms; VCD exporter test passes.
- Practice browser suite passes 10 lessons, 30 scenarios, exercises and quizzes, plus portrait/landscape layouts.
- Manual browser sequence confirms RAM 18/52 read-first and reset retention, full FIFO replacement using 17/34/51/68/85, and UART input 165 decoding to 165.
- Every embedded design/testbench and ZIP source matches its source file; Pages build succeeds.
- Temporary mutation copies reject early UART completion at cycle 36, reversed data as `got=69 expected=96`, stuck-high TX as missing completed bytes, and removal of synchronous decode cancellation as `got=fe expected=96`.
- The reset regression includes a single-clock reset between wire sampling instants, so merely checking reset when sampling data is insufficient.
