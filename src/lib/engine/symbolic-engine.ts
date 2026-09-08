import { Grid, DemonstrationPair, RuleHypothesis, PredictionResult } from "../arc/types";

// ==================== GRID UTILITIES ====================

export function cloneGrid(grid: Grid): Grid {
  return grid.map((row) => [...row]);
}

export function areGridsEqual(a: Grid, b: Grid): boolean {
  if (a.length !== b.length) return false;
  for (let r = 0; r < a.length; r++) {
    if (a[r].length !== b[r].length) return false;
    for (let c = 0; c < a[r].length; c++) {
      if (a[r][c] !== b[r][c]) return false;
    }
  }
  return true;
}

export function calculateGridMatch(a: Grid, b: Grid): { matching: number; total: number; accuracy: number } {
  const H = Math.min(a.length, b.length);
  const W = Math.min(a[0]?.length || 0, b[0]?.length || 0);
  let matching = 0;
  const total = Math.max(a.length * (a[0]?.length || 0), b.length * (b[0]?.length || 0));

  for (let r = 0; r < H; r++) {
    for (let c = 0; c < W; c++) {
      if (a[r][c] === b[r][c]) {
        matching++;
      }
    }
  }

  return {
    matching,
    total: total > 0 ? total : 1,
    accuracy: total > 0 ? matching / total : 0,
  };
}

// ==================== GEOMETRIC PRIMITIVES ====================

export function transformIdentity(grid: Grid): Grid {
  return cloneGrid(grid);
}

export function transformRotate90(grid: Grid): Grid {
  const H = grid.length;
  const W = grid[0].length;
  const out: Grid = Array.from({ length: W }, () => Array(H).fill(0));
  for (let r = 0; r < H; r++) {
    for (let c = 0; c < W; c++) {
      out[c][H - 1 - r] = grid[r][c];
    }
  }
  return out;
}

export function transformRotate180(grid: Grid): Grid {
  const H = grid.length;
  const W = grid[0].length;
  const out: Grid = Array.from({ length: H }, () => Array(W).fill(0));
  for (let r = 0; r < H; r++) {
    for (let c = 0; c < W; c++) {
      out[H - 1 - r][W - 1 - c] = grid[r][c];
    }
  }
  return out;
}

export function transformRotate270(grid: Grid): Grid {
  const H = grid.length;
  const W = grid[0].length;
  const out: Grid = Array.from({ length: W }, () => Array(H).fill(0));
  for (let r = 0; r < H; r++) {
    for (let c = 0; c < W; c++) {
      out[W - 1 - c][r] = grid[r][c];
    }
  }
  return out;
}

export function transformFlipHorizontal(grid: Grid): Grid {
  const H = grid.length;
  const W = grid[0].length;
  const out: Grid = Array.from({ length: H }, () => Array(W).fill(0));
  for (let r = 0; r < H; r++) {
    for (let c = 0; c < W; c++) {
      out[r][W - 1 - c] = grid[r][c];
    }
  }
  return out;
}

export function transformFlipVertical(grid: Grid): Grid {
  const H = grid.length;
  const W = grid[0].length;
  const out: Grid = Array.from({ length: H }, () => Array(W).fill(0));
  for (let r = 0; r < H; r++) {
    for (let c = 0; c < W; c++) {
      out[H - 1 - r][c] = grid[r][c];
    }
  }
  return out;
}

export function transformTranspose(grid: Grid): Grid {
  const H = grid.length;
  const W = grid[0].length;
  const out: Grid = Array.from({ length: W }, () => Array(H).fill(0));
  for (let r = 0; r < H; r++) {
    for (let c = 0; c < W; c++) {
      out[c][r] = grid[r][c];
    }
  }
  return out;
}

// ==================== MORPHOLOGY & GRAVITY ====================

export function transformFrameExtraction(grid: Grid): Grid {
  const H = grid.length;
  const W = grid[0].length;
  const out: Grid = Array.from({ length: H }, () => Array(W).fill(0));
  for (let r = 0; r < H; r++) {
    for (let c = 0; c < W; c++) {
      if (r === 0 || r === H - 1 || c === 0 || c === W - 1) {
        out[r][c] = grid[r][c];
      } else {
        out[r][c] = 0;
      }
    }
  }
  return out;
}

export function transformGravityDown(grid: Grid): Grid {
  const H = grid.length;
  const W = grid[0].length;
  const out: Grid = Array.from({ length: H }, () => Array(W).fill(0));
  for (let c = 0; c < W; c++) {
    const nonZeroes: number[] = [];
    for (let r = 0; r < H; r++) {
      if (grid[r][c] !== 0) nonZeroes.push(grid[r][c]);
    }
    const emptyCount = H - nonZeroes.length;
    for (let i = 0; i < nonZeroes.length; i++) {
      out[emptyCount + i][c] = nonZeroes[i];
    }
  }
  return out;
}

export function transformGravityUp(grid: Grid): Grid {
  const H = grid.length;
  const W = grid[0].length;
  const out: Grid = Array.from({ length: H }, () => Array(W).fill(0));
  for (let c = 0; c < W; c++) {
    const nonZeroes: number[] = [];
    for (let r = 0; r < H; r++) {
      if (grid[r][c] !== 0) nonZeroes.push(grid[r][c]);
    }
    for (let i = 0; i < nonZeroes.length; i++) {
      out[i][c] = nonZeroes[i];
    }
  }
  return out;
}

export function transformCountDominance(grid: Grid): Grid {
  const H = grid.length;
  const W = grid[0].length;
  const counts: Record<number, number> = {};
  for (let r = 0; r < H; r++) {
    for (let c = 0; c < W; c++) {
      const v = grid[r][c];
      if (v !== 0) {
        counts[v] = (counts[v] || 0) + 1;
      }
    }
  }

  let dominantColor = 0;
  let maxCount = -1;
  for (const [colorStr, count] of Object.entries(counts)) {
    const color = Number(colorStr);
    if (count > maxCount || (count === maxCount && color < dominantColor)) {
      maxCount = count;
      dominantColor = color;
    }
  }

  const out: Grid = cloneGrid(grid);
  if (dominantColor !== 0) {
    for (let r = 0; r < H; r++) {
      for (let c = 0; c < W; c++) {
        if (out[r][c] === 0) {
          out[r][c] = dominantColor;
        }
      }
    }
  }
  return out;
}

export function transformEnclosedFill(grid: Grid, fillColor: number = 4): Grid {
  const H = grid.length;
  const W = grid[0].length;
  const out: Grid = cloneGrid(grid);

  // Check if inner cells are bounded by non-zero perimeter
  for (let r = 1; r < H - 1; r++) {
    for (let c = 1; c < W - 1; c++) {
      if (grid[r][c] === 0) {
        // Simple flood/reachability check to boundary
        // If surrounded on all 4 directions by non-zero cells
        let north = false, south = false, east = false, west = false;
        for (let i = 0; i < r; i++) if (grid[i][c] !== 0) north = true;
        for (let i = r + 1; i < H; i++) if (grid[i][c] !== 0) south = true;
        for (let j = 0; j < c; j++) if (grid[r][j] !== 0) west = true;
        for (let j = c + 1; j < W; j++) if (grid[r][j] !== 0) east = true;

        if (north && south && east && west) {
          out[r][c] = fillColor;
        }
      }
    }
  }
  return out;
}

export function transformBoundingBoxCrop(grid: Grid): Grid {
  const H = grid.length;
  const W = grid[0].length;
  let minR = H, maxR = -1, minC = W, maxC = -1;

  for (let r = 0; r < H; r++) {
    for (let c = 0; c < W; c++) {
      if (grid[r][c] !== 0) {
        if (r < minR) minR = r;
        if (r > maxR) maxR = r;
        if (c < minC) minC = c;
        if (c > maxC) maxC = c;
      }
    }
  }

  const out: Grid = Array.from({ length: H }, () => Array(W).fill(0));
  if (maxR === -1) return out; // empty

  for (let r = minR; r <= maxR; r++) {
    for (let c = minC; c <= maxC; c++) {
      const targetR = r - minR;
      const targetC = c - minC;
      if (targetR < H && targetC < W) {
        out[targetR][targetC] = grid[r][c];
      }
    }
  }
  return out;
}

// ==================== COLOR MAP SOLVER ====================

interface ColorMappingResult {
  isConsistent: boolean;
  map: Record<number, number>;
  isBijective: boolean;
  isIdentity: boolean;
}

function solveColorMapping(sourceGrids: Grid[], targetGrids: Grid[]): ColorMappingResult {
  const map: Record<number, number> = {};
  const reverseMap: Record<number, number> = {};

  for (let i = 0; i < sourceGrids.length; i++) {
    const s = sourceGrids[i];
    const t = targetGrids[i];
    if (s.length !== t.length || s[0].length !== t[0].length) {
      return { isConsistent: false, map: {}, isBijective: false, isIdentity: false };
    }

    for (let r = 0; r < s.length; r++) {
      for (let c = 0; c < s[0].length; c++) {
        const inVal = s[r][c];
        const outVal = t[r][c];

        if (map[inVal] !== undefined && map[inVal] !== outVal) {
          return { isConsistent: false, map: {}, isBijective: false, isIdentity: false };
        }
        map[inVal] = outVal;
      }
    }
  }

  let isIdentity = true;
  let isBijective = true;
  for (const [inK, outV] of Object.entries(map)) {
    const k = Number(inK);
    if (k !== outV) isIdentity = false;
    if (reverseMap[outV] !== undefined && reverseMap[outV] !== k) {
      isBijective = false;
    }
    reverseMap[outV] = k;
  }

  return { isConsistent: true, map, isBijective, isIdentity };
}

function applyColorMap(grid: Grid, map: Record<number, number>): Grid {
  const H = grid.length;
  const W = grid[0].length;
  const out: Grid = Array.from({ length: H }, () => Array(W).fill(0));
  for (let r = 0; r < H; r++) {
    for (let c = 0; c < W; c++) {
      const v = grid[r][c];
      out[r][c] = map[v] !== undefined ? map[v] : v;
    }
  }
  return out;
}

// ==================== CANDIDATE GENERATOR ====================

interface GeometricCandidate {
  name: string;
  fn: (g: Grid) => Grid;
  complexity: number;
}

const GEOMETRIC_PRIMITIVES: GeometricCandidate[] = [
  { name: "Identity", fn: transformIdentity, complexity: 1.0 },
  { name: "Rotate 90° Clockwise", fn: transformRotate90, complexity: 1.2 },
  { name: "Rotate 180°", fn: transformRotate180, complexity: 1.3 },
  { name: "Rotate 270° Clockwise", fn: transformRotate270, complexity: 1.3 },
  { name: "Flip Horizontal (Left-Right)", fn: transformFlipHorizontal, complexity: 1.2 },
  { name: "Flip Vertical (Upside-Down)", fn: transformFlipVertical, complexity: 1.2 },
  { name: "Transpose (Diagonal)", fn: transformTranspose, complexity: 1.5 },
  { name: "Frame / Perimeter Extraction", fn: transformFrameExtraction, complexity: 1.6 },
  { name: "Downward Gravity Shift", fn: transformGravityDown, complexity: 1.5 },
  { name: "Upward Gravity Shift", fn: transformGravityUp, complexity: 1.6 },
  { name: "Count Dominance Fill", fn: transformCountDominance, complexity: 1.8 },
  { name: "Enclosed Center Fill (Yellow)", fn: (g) => transformEnclosedFill(g, 4), complexity: 1.45 },
  { name: "Bounding-Box Object Crop", fn: transformBoundingBoxCrop, complexity: 1.7 },
];

// ==================== SYMBOLIC ENGINE CORE ====================

export function runSymbolicSynthesis(
  demonstrations: DemonstrationPair[],
  testInput: Grid
): PredictionResult {
  const activeDemos = demonstrations.filter(d => d.input && d.output);
  if (activeDemos.length === 0) {
    return {
      predictedGrid: cloneGrid(testInput),
      confidenceGrid: testInput.map(r => r.map(() => 0)),
      isExactMatch: false,
      accuracyPercentage: 0,
      matchingCells: 0,
      totalCells: testInput.length * (testInput[0]?.length || 0),
      topHypotheses: [],
    };
  }

  const candidateHypotheses: RuleHypothesis[] = [];

  // Evaluate each geometric primitive, solving for color mapping
  for (const geom of GEOMETRIC_PRIMITIVES) {
    // Check if dimensions match outputs
    let dimensionsValid = true;
    const transformedInputs: Grid[] = [];

    for (const demo of activeDemos) {
      const transformed = geom.fn(demo.input);
      if (
        transformed.length !== demo.output.length ||
        transformed[0].length !== demo.output[0].length
      ) {
        dimensionsValid = false;
        break;
      }
      transformedInputs.push(transformed);
    }

    if (!dimensionsValid) continue;

    // Check color mapping consistency
    const colorResult = solveColorMapping(transformedInputs, activeDemos.map(d => d.output));

    let ruleFn: (g: Grid) => Grid;
    let ruleName: string;
    let ruleDesc: string;
    let complexity = geom.complexity;
    let family: RuleHypothesis["family"] = "affine";

    if (colorResult.isConsistent && !colorResult.isIdentity) {
      ruleFn = (g: Grid) => applyColorMap(geom.fn(g), colorResult.map);
      const mappingStr = Object.entries(colorResult.map)
        .filter(([k, v]) => Number(k) !== v)
        .map(([k, v]) => `${k}→${v}`)
        .join(", ");

      if (geom.name === "Identity") {
        ruleName = `Color Map (${mappingStr})`;
        ruleDesc = `Remap colors: ${mappingStr} preserving spatial geometry.`;
        complexity += 0.8;
        // Background replacement penalty: remapping background 0 is penalized vs structured morphology
        if (colorResult.map[0] !== undefined && colorResult.map[0] !== 0) {
          complexity += 0.6;
        }
        family = "color";
      } else {
        ruleName = `${geom.name} + Color Map (${mappingStr})`;
        ruleDesc = `Apply ${geom.name}, then remap colors: ${mappingStr}.`;
        complexity += 1.4;
        family = "composite";
      }
    } else {
      ruleFn = geom.fn;
      ruleName = geom.name;
      ruleDesc = `Apply spatial transformation: ${geom.name}.`;
      if (geom.name.includes("Gravity")) family = "gravity";
      else if (geom.name.includes("Frame") || geom.name.includes("Fill") || geom.name.includes("Crop")) family = "morphology";
      else family = "affine";
    }

    // Test hypothesis on all demonstrations
    const matchesDemos: boolean[] = [];
    const reasoningTrace: string[] = [];
    let totalMatchingCells = 0;
    let totalCells = 0;

    for (let i = 0; i < activeDemos.length; i++) {
      const demo = activeDemos[i];
      let predicted: Grid;
      try {
        predicted = ruleFn(demo.input);
      } catch {
        predicted = cloneGrid(demo.input);
      }

      const match = calculateGridMatch(predicted, demo.output);
      totalMatchingCells += match.matching;
      totalCells += match.total;

      const isExact = areGridsEqual(predicted, demo.output);
      matchesDemos.push(isExact);

      if (isExact) {
        reasoningTrace.push(`✓ Demo ${demo.id}: Exact match (${match.matching}/${match.total} cells).`);
      } else {
        reasoningTrace.push(
          `✗ Demo ${demo.id}: Failed with ${(match.accuracy * 100).toFixed(0)}% accuracy (${match.matching}/${match.total} cells).`
        );
      }
    }

    const overallAccuracy = totalCells > 0 ? totalMatchingCells / totalCells : 0;
    const allExact = matchesDemos.every(m => m);

    // Compute Occam's razor confidence
    let confidence: number;
    if (allExact) {
      // 100% on active demos, weighted by Occam penalty and demonstration count
      const dataEvidenceFactor = Math.min(1.0, 0.7 + activeDemos.length * 0.1);
      confidence = Math.max(50, Math.min(99.4, (100 - (complexity - 1.0) * 8) * dataEvidenceFactor));
    } else {
      confidence = Math.max(2, Math.min(45, overallAccuracy * 50 - complexity * 5));
    }

    candidateHypotheses.push({
      id: `hyp-${geom.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: ruleName,
      family,
      description: ruleDesc,
      confidence: Math.round(confidence * 10) / 10,
      complexityScore: Math.round(complexity * 10) / 10,
      matchesDemos,
      overallAccuracy: Math.round(overallAccuracy * 1000) / 10,
      reasoningTrace,
      apply: ruleFn,
    });
  }

  // Sort candidate hypotheses: exact matches first, then highest confidence, then lowest complexity
  candidateHypotheses.sort((a, b) => {
    const aExact = a.matchesDemos.every(m => m);
    const bExact = b.matchesDemos.every(m => m);
    if (aExact !== bExact) return aExact ? -1 : 1;
    if (b.confidence !== a.confidence) return b.confidence - a.confidence;
    return a.complexityScore - b.complexityScore;
  });

  const topHypotheses = candidateHypotheses.slice(0, 3);
  const bestRule = topHypotheses[0];

  let predictedGrid: Grid;
  try {
    predictedGrid = bestRule ? bestRule.apply(testInput) : cloneGrid(testInput);
  } catch {
    predictedGrid = cloneGrid(testInput);
  }

  // Calculate cell-by-cell confidence heatmap
  const H = predictedGrid.length;
  const W = predictedGrid[0]?.length || 0;
  const confidenceGrid: number[][] = Array.from({ length: H }, () => Array(W).fill(0));

  for (let r = 0; r < H; r++) {
    for (let c = 0; c < W; c++) {
      let cellCertaintySum = 0;
      let weightSum = 0;

      for (const hyp of topHypotheses) {
        let hypGrid: Grid;
        try {
          hypGrid = hyp.apply(testInput);
        } catch {
          hypGrid = cloneGrid(testInput);
        }

        const hypVal = hypGrid[r]?.[c];
        const weight = Math.max(1, hyp.confidence);
        weightSum += weight;

        if (hypVal === predictedGrid[r][c]) {
          cellCertaintySum += weight;
        }
      }

      confidenceGrid[r][c] = weightSum > 0 ? Math.round((cellCertaintySum / weightSum) * 100) : 100;
    }
  }

  return {
    predictedGrid,
    confidenceGrid,
    isExactMatch: bestRule ? bestRule.matchesDemos.every(m => m) : false,
    accuracyPercentage: bestRule ? bestRule.overallAccuracy : 0,
    matchingCells: 0,
    totalCells: H * W,
    topHypotheses,
  };
}
