import { Grid, Task } from "./types";
import {
  transformRotate90,
  transformRotate180,
  transformRotate270,
  transformFlipHorizontal,
  transformFlipVertical,
  transformGravityDown,
  transformFrameExtraction,
  cloneGrid,
} from "../engine/symbolic-engine";

/**
 * Generates an unseen test input and corresponding ground truth for a given task.
 */
export function generateUnseenProblem(task: Task): { input: Grid; expectedOutput: Grid } {
  const H = task.testCase.input.length || 3;
  const W = task.testCase.input[0]?.length || 3;

  // Generate randomized grid
  const colors = [1, 2, 3, 4, 6, 7]; // non-black ARC colors
  const newGrid: Grid = Array.from({ length: H }, () => Array(W).fill(0));

  // Populate 2 to 4 random cells
  const numFilled = Math.floor(Math.random() * 3) + 2;
  for (let i = 0; i < numFilled; i++) {
    const r = Math.floor(Math.random() * H);
    const c = Math.floor(Math.random() * W);
    const color = colors[Math.floor(Math.random() * colors.length)];
    newGrid[r][c] = color;
  }

  let expectedOutput: Grid;

  switch (task.id) {
    case "easy-rot-90":
      expectedOutput = transformRotate90(newGrid);
      break;
    case "easy-color-swap":
      expectedOutput = newGrid.map((row) =>
        row.map((cell) => (cell === 1 ? 2 : cell === 2 ? 1 : cell))
      );
      break;
    case "easy-flip-v":
      expectedOutput = transformFlipVertical(newGrid);
      break;
    case "med-flip-h-recolor":
      expectedOutput = transformFlipHorizontal(newGrid).map((row) =>
        row.map((c) => (c === 3 ? 7 : c))
      );
      break;
    case "med-frame":
      expectedOutput = transformFrameExtraction(newGrid);
      break;
    case "med-gravity":
      expectedOutput = transformGravityDown(newGrid);
      break;
    default:
      // Fallback: apply task's first demo transformation or standard rotation
      try {
        expectedOutput = transformRotate90(newGrid);
      } catch {
        expectedOutput = cloneGrid(newGrid);
      }
      break;
  }

  return { input: newGrid, expectedOutput };
}
