# FPGA learning path for C/Java programmers

The user approved the proposed four-stage redesign: earlier mental-model transitions, old/new-state interaction, a continuous button-counter case, and smaller steps toward UART echo. The reader knows C/Java but has no electronics or FPGA background.

## Learning experience

- Add a start page at `#start`, also the default entry. Explain four resources (logic, registers, memory, wires), what configuration does, and the distinction between the circuit and its testbench. Give a four-stage learning map and a small plain-language glossary.
- Keep every existing lesson ID, anchor, lab name and progress key. Navigation follows dependencies: `[1,2,3,4,5,11,6,14,13,7,12,15,8,9,16,17,18,19,20,10]`. Show route positions and identify stable lab numbers in the lesson header/source paths. The board workflow belongs after simulation competence.
- Every lesson gets a short programmer bridge, one learning objective, prerequisite links and a predictable activity sequence. Advanced verification details stay available under an explicitly optional disclosure; readers first run a supplied testbench, then modify it.
- Lesson 5 includes a code/circuit/trace/wave comparison of sequential C assignments and two edge-triggered nonblocking register assignments. Initial values 1/2 produce C 2/2 versus hardware 2/1. The simulation has an explicit initialization/clock distinction and a self-checking Vivado workshop.
- Lesson 15 includes a continuous button-counter workshop, connected from lessons 5/6/11/14: compare counting a held level, detecting an edge, and counting a debounced press. The same raw samples feed all three branches, so bouncing can be observed directly. Include hold, bounce and release scenarios and a self-checking Vivado workshop.
- Guided activities for each lesson progress from running, to changing one requirement, to completing a small code fragment, to independent work with an observable acceptance criterion. Lesson 20 is divided into standalone TX, RX, FIFO, connection and reset/error checkpoints with source signal references.
- Provide named downloadable starter files and runnable checks for the two new workshops; use the full worked source as a reference. Preserve the original 20 experiments and provide the workshop script separately.

## Technical boundaries

Use static ES modules and embedded SVG only. Pure models are separate from rendering. All links work under `/LearnEverything/fpga/` and in the downloadable standalone folder. No new external libraries. Reset/clock semantics and simulation-vs-physical-time labels must be explicit. Keep existing source and real VCD behavior unchanged for the 20 labs unless a concrete defect requires a fix.

## Acceptance

Fresh model tests cover sequential/simultaneous assignments, clock edges, reset, held buttons, bounce and single press. XSim validates both workshops and starter exercises fail before completion. Real browser checks cover the start page, new route and old anchors/progress, new demos, guided activities, downloads and narrow screens. Existing suites continue passing. Update the offline ZIP, README and deployed Pages using noreply commits.
