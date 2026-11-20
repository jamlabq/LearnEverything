# Programmer learning path implementation plan

**Goal:** Turn the approved tutorial into a progressive C/Java-to-FPGA course.
**Architecture:** Preserve numbered labs; layer dependency-based navigation and per-lesson teaching guidance over them, with two independent interactive workshops.
**Tech:** ES modules, inline SVG, SystemVerilog/XSim, Node, Python Playwright.

- [x] Create `src/learning-path.mjs` with the four stages, stable ID lookup and previous/next routes; test unique coverage and key dependencies in `tests/programmer-logic.test.mjs`.
- [x] Write failing semantic tests for assignment steps and sampled button counters. Implement pure state transitions in `src/programmer-logic.mjs`; no timers or DOM in the model.
- [x] Create two self-checking workshops under `workshops/`: old-value exchange and button counting. Add `scripts/run_workshops.sh`, starter files and explicit completion instructions. Validate with XSim, including failing starters.
- [x] Implement embedded circuit diagrams, step controls, histories and waves in `src/programmer-demos.js`. Mount in lessons 5 and 15 and clean up on navigation.
- [x] Create `src/learning-guide.js`: start page, programmer bridge and prerequisites for all 20 lessons, progressive exercises and five UART-project checkpoints. Keep advanced verification reading in optional disclosures.
- [x] Integrate into `src/app.js` and `index.html`; use stable IDs for progress and route neighbors for navigation. Style within `assets/style.css`, preserving narrow-screen behavior.
- [x] Clarify early syntax/HDL-vs-testbench explanations and cross-references. Update README study path and workshop instructions; include workshop assets in export ZIP.
- [x] Run Node tests, both XSim workshops, existing browser suites and new route/demo/browser checks. Build Pages, verify ZIP/links, and review the diff. Publication uses the existing authorization, main branch, noreply identity and Pages Actions; confirm the public deployment before the final response.

## Verification record

- Node: 50 tests passed, including both workshop models against real XSim VCD (1,579 signal comparisons).
- Vivado/XSim 2022.2: both reference workshops passed. The original incomplete starters failed on their intended assertions.
- Existing browser suites: all 20 experiments, 60 concept questions, original scenarios, progress, downloads and mobile layouts passed.
- New browser suite: four-stage route, all stable anchors, preserved progress, sequential/simultaneous assignment, held/bouncing/short buttons, reset, actual waves and expanded mobile panels passed.
- VCD exporter test passed. ZIP integrity and all 89 packaged files matched the current sources and built Pages.
- Browser smoke checks passed under the project Pages prefix and from an extracted standalone ZIP. Final review checked SVG direction, early exercise prerequisites, literal HDL symbols and stable lab-number references.
- Existing 20 HDL labs were unchanged; their exported XSim records remain covered by the model tests. No physical board was required or used.
