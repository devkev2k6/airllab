import { Task } from "./types";

export const TASK_BANK: Task[] = [
  // ==================== EASY TASKS ====================
  {
    id: "easy-rot-90",
    name: "90° Clockwise Rotation",
    category: "Easy",
    description: "Rotate the input grid by 90 degrees clockwise.",
    expectedRuleDescription: "Rotate 90° clockwise: cell at (r, c) moves to (c, width - 1 - r).",
    conceptKeywords: ["rotate", "90", "clockwise", "turn", "quarter"],
    demonstrations: [
      {
        id: 1,
        input: [
          [1, 0, 0],
          [1, 2, 0],
          [0, 0, 0],
        ],
        output: [
          [0, 1, 1],
          [0, 2, 0],
          [0, 0, 0],
        ],
      },
      {
        id: 2,
        input: [
          [0, 3, 3],
          [0, 0, 3],
          [0, 0, 0],
        ],
        output: [
          [0, 0, 0],
          [0, 0, 3],
          [0, 3, 3],
        ],
      },
      {
        id: 3,
        input: [
          [4, 0, 0],
          [0, 4, 0],
          [0, 0, 5],
        ],
        output: [
          [0, 0, 4],
          [0, 4, 0],
          [5, 0, 0],
        ],
      },
      {
        id: 4,
        input: [
          [6, 6, 0],
          [0, 6, 0],
          [0, 0, 0],
        ],
        output: [
          [0, 0, 6],
          [0, 6, 6],
          [0, 0, 0],
        ],
      },
    ],
    testCase: {
      input: [
        [0, 1, 0],
        [1, 1, 2],
        [0, 0, 0],
      ],
      expectedOutput: [
        [0, 1, 0],
        [0, 1, 1],
        [0, 2, 0],
      ],
    },
    breakTheRulePreset: {
      input: [
        [1, 1, 1],
        [1, 0, 1],
        [1, 1, 1],
      ],
      description: "Symmetric Frame: A 90° rotation looks identical to 180°, 270°, or reflection!",
      expectedBehaviorNote: "Exposes rotational symmetry ambiguity when fewer demos are active.",
    },
  },
  {
    id: "easy-color-swap",
    name: "Color Swap (Blue ↔ Red)",
    category: "Easy",
    description: "Swap Blue (1) and Red (2) colors while preserving spatial structure.",
    expectedRuleDescription: "Bijective color swap: Color 1 becomes Color 2, Color 2 becomes Color 1; all other colors remain intact.",
    conceptKeywords: ["color", "swap", "blue", "red", "exchange", "invert"],
    demonstrations: [
      {
        id: 1,
        input: [
          [1, 0, 2],
          [0, 1, 0],
          [2, 0, 1],
        ],
        output: [
          [2, 0, 1],
          [0, 2, 0],
          [1, 0, 2],
        ],
      },
      {
        id: 2,
        input: [
          [1, 1, 0],
          [0, 2, 2],
          [0, 0, 0],
        ],
        output: [
          [2, 2, 0],
          [0, 1, 1],
          [0, 0, 0],
        ],
      },
      {
        id: 3,
        input: [
          [0, 2, 0],
          [1, 2, 1],
          [0, 1, 0],
        ],
        output: [
          [0, 1, 0],
          [2, 1, 2],
          [0, 2, 0],
        ],
      },
      {
        id: 4,
        input: [
          [2, 0, 0],
          [0, 1, 0],
          [0, 0, 2],
        ],
        output: [
          [1, 0, 0],
          [0, 2, 0],
          [0, 0, 1],
        ],
      },
    ],
    testCase: {
      input: [
        [1, 2, 1],
        [2, 0, 2],
        [1, 2, 1],
      ],
      expectedOutput: [
        [2, 1, 2],
        [1, 0, 1],
        [2, 1, 2],
      ],
    },
    breakTheRulePreset: {
      input: [
        [3, 3, 0],
        [0, 3, 0],
        [0, 0, 3],
      ],
      description: "Novel Color (Green 3): The swap rule has only seen Blue and Red!",
      expectedBehaviorNote: "Forces model to evaluate how it handles unseen colors.",
    },
  },
  {
    id: "easy-reflect-vertical",
    name: "Vertical Reflection (Flip Y)",
    category: "Easy",
    description: "Reflect the grid vertically along the horizontal midline (upside-down flip).",
    expectedRuleDescription: "Vertical flip: cell at (r, c) moves to (height - 1 - r, c).",
    conceptKeywords: ["vertical", "flip", "upside", "down", "reflect", "mirror", "y-axis"],
    demonstrations: [
      {
        id: 1,
        input: [
          [3, 3, 0],
          [0, 3, 0],
          [0, 0, 0],
        ],
        output: [
          [0, 0, 0],
          [0, 3, 0],
          [3, 3, 0],
        ],
      },
      {
        id: 2,
        input: [
          [1, 2, 4],
          [0, 0, 0],
          [0, 0, 0],
        ],
        output: [
          [0, 0, 0],
          [0, 0, 0],
          [1, 2, 4],
        ],
      },
      {
        id: 3,
        input: [
          [0, 0, 7],
          [0, 7, 0],
          [7, 0, 0],
        ],
        output: [
          [7, 0, 0],
          [0, 7, 0],
          [0, 0, 7],
        ],
      },
      {
        id: 4,
        input: [
          [5, 5, 5],
          [0, 5, 0],
          [0, 0, 0],
        ],
        output: [
          [0, 0, 0],
          [0, 5, 0],
          [5, 5, 5],
        ],
      },
    ],
    testCase: {
      input: [
        [8, 0, 8],
        [8, 8, 8],
        [0, 0, 0],
      ],
      expectedOutput: [
        [0, 0, 0],
        [8, 8, 8],
        [8, 0, 8],
      ],
    },
    breakTheRulePreset: {
      input: [
        [6, 0, 6],
        [0, 6, 0],
        [6, 0, 6],
      ],
      description: "Vertically symmetric 'X' pattern: Vertical flip yields the identical grid!",
      expectedBehaviorNote: "Induces confusion between Identity, Vertical Flip, and Horizontal Flip.",
    },
  },

  // ==================== MEDIUM TASKS ====================
  {
    id: "med-reflect-color",
    name: "Horizontal Flip + Recolor (Green → Orange)",
    category: "Medium",
    description: "Reflect horizontally (left-right mirror) and recolor all Green (3) cells to Orange (7).",
    expectedRuleDescription: "Composite rule: Horizontal flip (x -> W-1-x) followed by color remapping (3 -> 7).",
    conceptKeywords: ["horizontal", "flip", "mirror", "recolor", "green", "orange", "color"],
    demonstrations: [
      {
        id: 1,
        input: [
          [3, 0, 0],
          [3, 3, 0],
          [0, 0, 0],
        ],
        output: [
          [0, 0, 7],
          [0, 7, 7],
          [0, 0, 0],
        ],
      },
      {
        id: 2,
        input: [
          [0, 3, 3],
          [0, 0, 3],
          [0, 0, 0],
        ],
        output: [
          [7, 7, 0],
          [7, 0, 0],
          [0, 0, 0],
        ],
      },
      {
        id: 3,
        input: [
          [3, 0, 3],
          [0, 0, 3],
          [0, 0, 0],
        ],
        output: [
          [7, 0, 7],
          [7, 0, 0],
          [0, 0, 0],
        ],
      },
      {
        id: 4,
        input: [
          [0, 0, 3],
          [0, 3, 3],
          [3, 3, 3],
        ],
        output: [
          [7, 0, 0],
          [7, 7, 0],
          [7, 7, 7],
        ],
      },
    ],
    testCase: {
      input: [
        [3, 3, 0],
        [0, 3, 0],
        [3, 0, 0],
      ],
      expectedOutput: [
        [0, 7, 7],
        [0, 7, 0],
        [0, 0, 7],
      ],
    },
    breakTheRulePreset: {
      input: [
        [0, 3, 0],
        [3, 3, 3],
        [0, 3, 0],
      ],
      description: "Horizontally symmetric cross: Flipping left-right is invisible, testing pure color swap isolation.",
      expectedBehaviorNote: "Reveals whether model can isolate color transform independent of geometry.",
    },
  },
  {
    id: "med-frame-extraction",
    name: "Frame / Perimeter Extraction",
    category: "Medium",
    description: "Retain only the outermost perimeter border of the grid; clear all inner cells to black (0).",
    expectedRuleDescription: "Keep outer frame: cells at r=0, r=H-1, c=0, c=W-1 are preserved; interior (r in 1..H-2, c in 1..W-2) becomes 0.",
    conceptKeywords: ["frame", "perimeter", "border", "hollow", "clear", "interior", "center"],
    demonstrations: [
      {
        id: 1,
        input: [
          [4, 4, 4, 4],
          [4, 1, 1, 4],
          [4, 1, 1, 4],
          [4, 4, 4, 4],
        ],
        output: [
          [4, 4, 4, 4],
          [4, 0, 0, 4],
          [4, 0, 0, 4],
          [4, 4, 4, 4],
        ],
      },
      {
        id: 2,
        input: [
          [2, 3, 2, 3],
          [3, 5, 5, 2],
          [2, 5, 5, 3],
          [3, 2, 3, 2],
        ],
        output: [
          [2, 3, 2, 3],
          [3, 0, 0, 2],
          [2, 0, 0, 3],
          [3, 2, 3, 2],
        ],
      },
      {
        id: 3,
        input: [
          [6, 6, 6, 6],
          [6, 6, 6, 6],
          [6, 6, 6, 6],
          [6, 6, 6, 6],
        ],
        output: [
          [6, 6, 6, 6],
          [6, 0, 0, 6],
          [6, 0, 0, 6],
          [6, 6, 6, 6],
        ],
      },
      {
        id: 4,
        input: [
          [7, 0, 0, 7],
          [0, 8, 8, 0],
          [0, 8, 8, 0],
          [7, 0, 0, 7],
        ],
        output: [
          [7, 0, 0, 7],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [7, 0, 0, 7],
        ],
      },
    ],
    testCase: {
      input: [
        [8, 8, 8, 8],
        [8, 2, 3, 8],
        [8, 4, 5, 8],
        [8, 8, 8, 8],
      ],
      expectedOutput: [
        [8, 8, 8, 8],
        [8, 0, 0, 8],
        [8, 0, 0, 8],
        [8, 8, 8, 8],
      ],
    },
    breakTheRulePreset: {
      input: [
        [0, 0, 0],
        [0, 9, 0],
        [0, 0, 0],
      ],
      description: "Single central pixel: All perimeter cells are 0, center pixel gets erased completely!",
      expectedBehaviorNote: "Results in empty 0-grid, checking edge case of null border.",
    },
  },
  {
    id: "med-downward-gravity",
    name: "Downward Gravity Shift",
    category: "Medium",
    description: "All colored cells drop straight down to the bottom of the grid under gravity.",
    expectedRuleDescription: "Gravity fall: within each column, non-zero values settle at the bottom maintaining relative order.",
    conceptKeywords: ["gravity", "fall", "drop", "down", "settle", "bottom"],
    demonstrations: [
      {
        id: 1,
        input: [
          [1, 0, 2],
          [0, 0, 0],
          [0, 0, 0],
        ],
        output: [
          [0, 0, 0],
          [0, 0, 0],
          [1, 0, 2],
        ],
      },
      {
        id: 2,
        input: [
          [3, 4, 0],
          [0, 0, 5],
          [0, 0, 0],
        ],
        output: [
          [0, 0, 0],
          [0, 0, 0],
          [3, 4, 5],
        ],
      },
      {
        id: 3,
        input: [
          [2, 0, 0],
          [1, 0, 0],
          [0, 0, 0],
        ],
        output: [
          [0, 0, 0],
          [2, 0, 0],
          [1, 0, 0],
        ],
      },
      {
        id: 4,
        input: [
          [0, 6, 0],
          [7, 0, 0],
          [0, 0, 8],
        ],
        output: [
          [0, 0, 0],
          [0, 0, 0],
          [7, 6, 8],
        ],
      },
    ],
    testCase: {
      input: [
        [4, 0, 1],
        [0, 3, 0],
        [0, 0, 0],
      ],
      expectedOutput: [
        [0, 0, 0],
        [0, 0, 0],
        [4, 3, 1],
      ],
    },
    breakTheRulePreset: {
      input: [
        [0, 0, 0],
        [0, 0, 0],
        [2, 3, 4],
      ],
      description: "Already settled: All cells are already on the bottom row.",
      expectedBehaviorNote: "Tests identity invariance under gravity saturation.",
    },
  },

  // ==================== TRICKY / ADVERSARIAL TASKS ====================
  {
    id: "tricky-count-dominance",
    name: "Count-Based Color Dominance",
    category: "Tricky",
    description: "Identify the most frequent non-zero color in the grid and fill all empty background cells (0) with that color.",
    expectedRuleDescription: "Dominance fill: calculate argmax count of non-zero colors; replace all 0 cells with the dominant color.",
    conceptKeywords: ["count", "majority", "dominant", "most", "frequent", "fill", "background"],
    demonstrations: [
      {
        id: 1,
        input: [
          [1, 0, 1],
          [0, 2, 0],
          [1, 0, 0],
        ],
        output: [
          [1, 1, 1],
          [1, 2, 1],
          [1, 1, 1],
        ],
      },
      {
        id: 2,
        input: [
          [3, 0, 3],
          [0, 3, 0],
          [4, 0, 0],
        ],
        output: [
          [3, 3, 3],
          [3, 3, 3],
          [4, 3, 3],
        ],
      },
      {
        id: 3,
        input: [
          [6, 6, 0],
          [0, 7, 0],
          [6, 0, 0],
        ],
        output: [
          [6, 6, 6],
          [6, 7, 6],
          [6, 6, 6],
        ],
      },
      {
        id: 4,
        input: [
          [8, 0, 0],
          [0, 8, 8],
          [2, 0, 0],
        ],
        output: [
          [8, 8, 8],
          [8, 8, 8],
          [2, 8, 8],
        ],
      },
    ],
    testCase: {
      input: [
        [0, 2, 0],
        [2, 0, 2],
        [0, 1, 0],
      ],
      expectedOutput: [
        [2, 2, 2],
        [2, 2, 2],
        [2, 1, 2],
      ],
    },
    breakTheRulePreset: {
      input: [
        [1, 0, 2],
        [0, 0, 0],
        [2, 0, 1],
      ],
      description: "Tie-Breaker Conflict: Equal count of Blue (1) and Red (2) (2 each).",
      expectedBehaviorNote: "Breaks naive dominance classifiers lacking a deterministic tie-breaker.",
    },
  },
  {
    id: "tricky-enclosed-fill",
    name: "Enclosed Center Fill",
    category: "Tricky",
    description: "Find the enclosed central hollow area surrounded by a border and fill it with Yellow (4).",
    expectedRuleDescription: "Topological fill: internal non-border cells completely surrounded by colored cells become Yellow (4).",
    conceptKeywords: ["enclosed", "hole", "center", "inside", "surround", "fill", "yellow"],
    demonstrations: [
      {
        id: 1,
        input: [
          [1, 1, 1],
          [1, 0, 1],
          [1, 1, 1],
        ],
        output: [
          [1, 1, 1],
          [1, 4, 1],
          [1, 1, 1],
        ],
      },
      {
        id: 2,
        input: [
          [2, 2, 2],
          [2, 0, 2],
          [2, 2, 2],
        ],
        output: [
          [2, 2, 2],
          [2, 4, 2],
          [2, 2, 2],
        ],
      },
      {
        id: 3,
        input: [
          [3, 3, 3, 3],
          [3, 0, 0, 3],
          [3, 0, 0, 3],
          [3, 3, 3, 3],
        ],
        output: [
          [3, 3, 3, 3],
          [3, 4, 4, 3],
          [3, 4, 4, 3],
          [3, 3, 3, 3],
        ],
      },
      {
        id: 4,
        input: [
          [8, 8, 8],
          [8, 0, 8],
          [8, 8, 8],
        ],
        output: [
          [8, 8, 8],
          [8, 4, 8],
          [8, 8, 8],
        ],
      },
    ],
    testCase: {
      input: [
        [6, 6, 6],
        [6, 0, 6],
        [6, 6, 6],
      ],
      expectedOutput: [
        [6, 6, 6],
        [6, 4, 6],
        [6, 6, 6],
      ],
    },
    breakTheRulePreset: {
      input: [
        [1, 1, 1],
        [1, 0, 0],
        [1, 1, 1],
      ],
      description: "Leaky Boundary (C-shape): The center has an open breach to the perimeter.",
      expectedBehaviorNote: "Exposes whether the engine checks true topological enclosure vs center coordinate heuristic.",
    },
  },
  {
    id: "tricky-bounding-box-crop",
    name: "Bounding-Box Object Crop",
    category: "Tricky",
    description: "Locate the smallest bounding box containing all non-zero cells and isolate it onto a centered canonical frame.",
    expectedRuleDescription: "Morphological crop: extract the subgrid bounding box of non-zero pixels and frame it.",
    conceptKeywords: ["bounding", "box", "crop", "isolate", "object", "extract"],
    demonstrations: [
      {
        id: 1,
        input: [
          [0, 0, 0, 0],
          [0, 7, 7, 0],
          [0, 7, 0, 0],
          [0, 0, 0, 0],
        ],
        output: [
          [7, 7, 0, 0],
          [7, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ],
      },
      {
        id: 2,
        input: [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 2, 2, 2],
          [0, 0, 0, 0],
        ],
        output: [
          [2, 2, 2, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ],
      },
      {
        id: 3,
        input: [
          [0, 0, 0, 0],
          [0, 0, 3, 0],
          [0, 0, 3, 3],
          [0, 0, 0, 0],
        ],
        output: [
          [3, 0, 0, 0],
          [3, 3, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ],
      },
      {
        id: 4,
        input: [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 5, 5],
          [0, 0, 5, 5],
        ],
        output: [
          [5, 5, 0, 0],
          [5, 5, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ],
      },
    ],
    testCase: {
      input: [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
      ],
      expectedOutput: [
        [1, 1, 0, 0],
        [1, 1, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
    },
    breakTheRulePreset: {
      input: [
        [4, 0, 0, 4],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [4, 0, 0, 4],
      ],
      description: "Spanning Corners: Bounding box spans the entire grid!",
      expectedBehaviorNote: "Bounding box equals the original grid, testing boundary condition.",
    },
  },
];
