export type ArcColor = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface ArcColorMeta {
  id: ArcColor;
  name: string;
  hex: string;
  textColor: string;
}

export const ARC_COLORS: Record<ArcColor, ArcColorMeta> = {
  0: { id: 0, name: "Black", hex: "#18181B", textColor: "#FFFFFF" },
  1: { id: 1, name: "Blue", hex: "#2563EB", textColor: "#FFFFFF" },
  2: { id: 2, name: "Red", hex: "#DC2626", textColor: "#FFFFFF" },
  3: { id: 3, name: "Green", hex: "#16A34A", textColor: "#FFFFFF" },
  4: { id: 4, name: "Yellow", hex: "#EAB308", textColor: "#000000" },
  5: { id: 5, name: "Grey", hex: "#6B7280", textColor: "#FFFFFF" },
  6: { id: 6, name: "Magenta", hex: "#C026D3", textColor: "#FFFFFF" },
  7: { id: 7, name: "Orange", hex: "#EA580C", textColor: "#FFFFFF" },
  8: { id: 8, name: "Teal", hex: "#0D9488", textColor: "#FFFFFF" },
  9: { id: 9, name: "Maroon", hex: "#881337", textColor: "#FFFFFF" },
};

export type Grid = number[][];

export interface DemonstrationPair {
  id: number;
  input: Grid;
  output: Grid;
}

export interface TestCase {
  input: Grid;
  expectedOutput: Grid;
}

export type TaskCategory = "Easy" | "Medium" | "Tricky";

export interface Task {
  id: string;
  name: string;
  category: TaskCategory;
  description: string;
  expectedRuleDescription: string;
  demonstrations: DemonstrationPair[];
  testCase: TestCase;
  breakTheRulePreset?: {
    input: Grid;
    description: string;
    expectedBehaviorNote: string;
  };
  conceptKeywords: string[];
}

export interface RuleHypothesis {
  id: string;
  name: string;
  family: "affine" | "color" | "composite" | "morphology" | "gravity";
  description: string;
  confidence: number; // 0 - 100%
  complexityScore: number; // simplicity prior (lower is simpler)
  matchesDemos: boolean[];
  overallAccuracy: number;
  reasoningTrace: string[];
  apply: (grid: Grid) => Grid;
}

export interface PredictionResult {
  predictedGrid: Grid;
  confidenceGrid: number[][]; // 0 - 100 for each cell
  isExactMatch: boolean;
  accuracyPercentage: number;
  matchingCells: number;
  totalCells: number;
  topHypotheses: RuleHypothesis[];
}

export interface BdhLatentStep {
  stepIndex: number;
  demonstrationId?: number;
  label: string;
  description: string;
  latentVector: number[]; // 16-dim normalized activation vector
  entropy: number;
  associativeMagnitude: number;
  convergedFeatures: string[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}
