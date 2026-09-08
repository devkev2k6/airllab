import { TASK_BANK } from "../src/lib/arc/task-bank";
import { runSymbolicSynthesis, areGridsEqual, calculateGridMatch } from "../src/lib/engine/symbolic-engine";

console.log("=================================================");
console.log("ARC-AGI Rule Induction Engine Benchmark & Audit");
console.log("=================================================");

let allPassed = true;
let totalTimeMs = 0;

for (const task of TASK_BANK) {
  const start = performance.now();
  const result = runSymbolicSynthesis(task.demonstrations, task.testCase.input);
  const elapsed = performance.now() - start;
  totalTimeMs += elapsed;

  const topHypothesis = result.topHypotheses[0];
  const isMatch = areGridsEqual(result.predictedGrid, task.testCase.expectedOutput);
  const matchStats = calculateGridMatch(result.predictedGrid, task.testCase.expectedOutput);

  console.log(`\n[Task] ${task.name} (${task.category})`);
  console.log(`  Top Hypothesis : ${topHypothesis ? topHypothesis.name : "None"}`);
  console.log(`  Confidence     : ${topHypothesis ? topHypothesis.confidence : 0}%`);
  console.log(`  Elapsed Time   : ${elapsed.toFixed(2)} ms`);
  console.log(`  Test Match     : ${isMatch ? "PASS (100%)" : `FAIL (${(matchStats.accuracy * 100).toFixed(1)}%)`}`);

  if (!isMatch) {
    allPassed = false;
    console.error("  Expected Output:\n", task.testCase.expectedOutput);
    console.error("  Predicted Output:\n", result.predictedGrid);
  }
}

console.log("\n=================================================");
console.log(`Summary: ${TASK_BANK.length} Tasks Tested`);
console.log(`Average Latency: ${(totalTimeMs / TASK_BANK.length).toFixed(2)} ms / task`);
console.log(`Overall Status : ${allPassed ? "ALL 9 TASKS PASSED (100% ACCURACY)" : "SOME TASKS FAILED"}`);
console.log("=================================================");

if (!allPassed) {
  process.exit(1);
}
