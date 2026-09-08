"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  AlertOctagon,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Terminal,
  Sparkles,
  Info,
} from "lucide-react";
import { GridEditor } from "../sandbox/GridEditor";
import { Grid } from "@/lib/arc/types";

interface FailureScenario {
  id: string;
  typeNumber: number;
  title: string;
  shortDescription: string;
  category: "Few Demonstrations" | "Ambiguous Examples" | "Contradictory Examples" | "Complex Rules";
  demoPairs: { input: Grid; output: Grid }[];
  testInput: Grid;
  aiPredicted: Grid;
  groundTruth: Grid;
  whyItFailed: string;
  howToFix: string;
  rootCauseTag: string;
}

const FAILURE_SCENARIOS: FailureScenario[] = [
  {
    id: "fail-few-demos",
    typeNumber: 1,
    title: "Failure Type 1: Few Demonstrations (Underconstrained)",
    shortDescription: "Only 1 demonstration provided. Many contradictory hypotheses fit this single example.",
    category: "Few Demonstrations",
    demoPairs: [
      {
        input: [
          [1, 1],
          [0, 0],
        ],
        output: [
          [0, 0],
          [1, 1],
        ],
      },
    ],
    testInput: [
      [1, 0],
      [0, 0],
    ],
    aiPredicted: [
      [0, 0],
      [1, 0],
    ], // AI guessed vertical shift/flip
    groundTruth: [
      [0, 0],
      [0, 1],
    ], // True rule was 180° rotation
    whyItFailed:
      "Because the single demonstration had horizontal symmetry (row [1, 1]), both 'Flip Vertical' and 'Rotate 180°' produced identical outputs on Demo 1. With only 1 pair, the model had no mathematical way to know the designer intended rotation instead of a vertical flip.",
    howToFix:
      "Add at least one asymmetric demonstration pair (e.g., an L-shape) that breaks the tie between reflection and rotation.",
    rootCauseTag: "Epistemic Ambiguity / Insufficient Constraint",
  },
  {
    id: "fail-ambiguity",
    typeNumber: 2,
    title: "Failure Type 2: Ambiguous Examples (Symmetry Trap)",
    shortDescription: "Input contains rotational or reflection symmetries where multiple distinct rules produce identical outputs.",
    category: "Ambiguous Examples",
    demoPairs: [
      {
        input: [
          [2, 0, 2],
          [0, 0, 0],
          [2, 0, 2],
        ],
        output: [
          [2, 0, 2],
          [0, 0, 0],
          [2, 0, 2],
        ],
      },
      {
        input: [
          [0, 3, 0],
          [3, 0, 3],
          [0, 3, 0],
        ],
        output: [
          [0, 3, 0],
          [3, 0, 3],
          [0, 3, 0],
        ],
      },
    ],
    testInput: [
      [4, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ],
    aiPredicted: [
      [4, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ], // Guessed Identity f(x)=x
    groundTruth: [
      [0, 0, 4],
      [0, 0, 0],
      [0, 0, 0],
    ], // True rule: Flip Horizontal
    whyItFailed:
      "All demonstrations featured 4-way bilateral symmetry. Both Identity f(x)=x, Rotate 90°, and Horizontal Flip yield 100% training accuracy. The model selected Identity due to minimum Occam complexity score, but the true task was Horizontal Flip.",
    howToFix:
      "Never use palindromic or radially symmetric inputs to demonstrate orientation changes.",
    rootCauseTag: "Spurious Symmetry / Inductive Bias Trap",
  },
  {
    id: "fail-contradiction",
    typeNumber: 3,
    title: "Failure Type 3: Contradictory Examples (Noise)",
    shortDescription: "Demonstrations contain human annotation errors or conflicting rules that break determinism.",
    category: "Contradictory Examples",
    demoPairs: [
      {
        input: [
          [1, 0],
          [0, 0],
        ],
        output: [
          [0, 1],
          [0, 0],
        ], // Demo 1: Shift right
      },
      {
        input: [
          [1, 0],
          [0, 0],
        ],
        output: [
          [0, 0],
          [1, 0],
        ], // Demo 2: Same input, but shifted DOWN! Contradiction!
      },
    ],
    testInput: [
      [2, 0],
      [0, 0],
    ],
    aiPredicted: [
      [2, 0],
      [0, 0],
    ], // Collapsed to fallback Identity
    groundTruth: [
      [0, 2],
      [0, 0],
    ],
    whyItFailed:
      "Demo 1 maps [1,0] to [0,1], while Demo 2 maps [1,0] to [0,0; 1,0]. A deterministic function f(x) cannot produce two distinct outputs for the exact same input. The symbolic search pruned all hypotheses and defaulted to identity.",
    howToFix:
      "Sanitize dataset for one-to-one consistency, or switch to probabilistic soft-attentive models like BDH-CQ that can tolerate noisy margins.",
    rootCauseTag: "Deterministic Violation / Data Corruption",
  },
  {
    id: "fail-complex",
    typeNumber: 4,
    title: "Failure Type 4: Complex / Composed Rules (Depth Limit)",
    shortDescription: "Transformation requires 3+ non-linear steps exceeding grammar depth.",
    category: "Complex Rules",
    demoPairs: [
      {
        input: [
          [1, 2, 0],
          [0, 3, 0],
          [0, 0, 4],
        ],
        output: [
          [4, 0, 0],
          [0, 7, 0],
          [0, 6, 5],
        ], // Rotate 180 + Recolor All + Diagonal Invert
      },
    ],
    testInput: [
      [3, 0, 0],
      [0, 2, 0],
      [0, 0, 1],
    ],
    aiPredicted: [
      [0, 0, 3],
      [0, 2, 0],
      [1, 0, 0],
    ], // Only performed 1 partial step
    groundTruth: [
      [1, 0, 0],
      [0, 6, 0],
      [0, 0, 7],
    ],
    whyItFailed:
      "Combinatorial explosion: searching compositions of length >= 3 requires evaluating millions of primitive combinations. Real-time client-side symbolic search limits depth to preserve &lt;10ms latency.",
    howToFix:
      "Use hierarchical DSL chunking, neural guided search (DreamCoder), or continuous latent representation (BDH-CQ).",
    rootCauseTag: "Combinatorial Explosion / Grammar Horizon",
  },
];

export function FailureAnalysisLab() {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(FAILURE_SCENARIOS[0].id);

  const scenario =
    FAILURE_SCENARIOS.find((s) => s.id === selectedScenarioId) || FAILURE_SCENARIOS[0];

  return (
    <section id="failure-lab" className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-rose-400 text-xs font-mono mb-1">
            <AlertOctagon className="h-4 w-4" />
            <span>Diagnostic Breakdown (Must-Have Feature)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Why Did AI Fail? Failure Analysis Lab
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Real science investigates failure. Explore the 4 core failure modes where inductive models breakdown.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-rose-950/60 border border-rose-500/30 text-rose-300">
            4 Failure Modes Grounded
          </span>
        </div>
      </div>

      {/* 4 Failure Mode Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {FAILURE_SCENARIOS.map((s) => {
          const isSelected = s.id === selectedScenarioId;
          return (
            <button
              key={s.id}
              onClick={() => setSelectedScenarioId(s.id)}
              className={`p-3.5 rounded-xl text-left border transition flex flex-col justify-between ${
                isSelected
                  ? "bg-rose-950/50 border-rose-500 text-white shadow-lg shadow-rose-950/40 ring-1 ring-rose-500/50"
                  : "bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="h-6 w-6 rounded-md bg-rose-500/20 text-rose-300 flex items-center justify-center font-mono font-bold text-xs">
                    0{s.typeNumber}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                    {s.category}
                  </span>
                </div>
                <h4 className="text-xs font-bold leading-snug">{s.title.split(": ")[1]}</h4>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">{s.shortDescription}</p>
            </button>
          );
        })}
      </div>

      {/* Active Failure Case Interactive Canvas */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-rose-500/40 shadow-xl space-y-6">
        {/* Scenario Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-rose-400 font-bold block">
              Case Study: {scenario.category}
            </span>
            <h3 className="text-lg font-bold text-white">{scenario.title}</h3>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300">
            Root Cause: {scenario.rootCauseTag}
          </span>
        </div>

        {/* Demonstrations that caused the failure */}
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase text-slate-400 font-bold block">
            Demonstrations Provided to Model ({scenario.demoPairs.length}):
          </span>
          <div className="flex flex-wrap items-center gap-4">
            {scenario.demoPairs.map((dp, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center space-x-3"
              >
                <div className="flex flex-col items-center">
                  <GridEditor grid={dp.input} size="sm" isReadOnly={true} title="Input" />
                </div>
                <ArrowRight className="h-4 w-4 text-slate-500" />
                <div className="flex flex-col items-center">
                  <GridEditor grid={dp.output} size="sm" isReadOnly={true} title="Output" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Unseen Test Evaluation & Discrepancy */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <span className="text-xs font-mono uppercase text-slate-400 font-bold block">
            Test Evaluation: Predicted vs Ground Truth
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center justify-items-center">
            {/* Test Input */}
            <div className="flex flex-col items-center">
              <GridEditor
                grid={scenario.testInput}
                size="md"
                isReadOnly={true}
                title="Unseen Test Input"
              />
            </div>

            {/* AI Predicted (Wrong) */}
            <div className="flex flex-col items-center">
              <GridEditor
                grid={scenario.aiPredicted}
                size="md"
                isReadOnly={true}
                title="AI Predicted (FAILED)"
              />
              <span className="text-[11px] font-mono text-rose-400 mt-1 flex items-center space-x-1">
                <XCircle className="h-3.5 w-3.5" />
                <span>Incorrect Prediction</span>
              </span>
            </div>

            {/* Ground Truth */}
            <div className="flex flex-col items-center">
              <GridEditor
                grid={scenario.groundTruth}
                size="md"
                isReadOnly={true}
                title="Ground Truth (Target)"
              />
              <span className="text-[11px] font-mono text-emerald-400 mt-1 flex items-center space-x-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Intended Solution</span>
              </span>
            </div>
          </div>
        </div>

        {/* Deep Post-Mortem & Fix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-rose-500/30 space-y-2">
            <h4 className="text-xs font-bold font-mono text-rose-400 uppercase flex items-center space-x-1.5">
              <Terminal className="h-3.5 w-3.5" />
              <span>Diagnostic Post-Mortem: Why Did It Fail?</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">{scenario.whyItFailed}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30 space-y-2">
            <h4 className="text-xs font-bold font-mono text-emerald-400 uppercase flex items-center space-x-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Engineering Solution: How to Fix</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">{scenario.howToFix}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
