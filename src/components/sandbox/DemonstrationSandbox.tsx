"use client";

import React, { useState } from "react";
import { Task, DemonstrationPair, PredictionResult } from "@/lib/arc/types";
import { GridEditor } from "./GridEditor";
import { BreakTheRuleModal } from "./BreakTheRuleModal";
import { AlgebraicDemoLab } from "./AlgebraicDemoLab";
import { cloneGrid } from "@/lib/engine/symbolic-engine";
import {
  Layers,
  ArrowRight,
  Sliders,
  ShieldAlert,
  Sparkles,
  Info,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Plus,
  Trash2,
  Dice5,
  Calculator,
} from "lucide-react";

interface DemonstrationSandboxProps {
  currentTask: Task;
  onSelectTask: (task: Task) => void;
  allTasks: Task[];
  demoCount: number;
  setDemoCount: (count: number) => void;
  activeDemonstrations: DemonstrationPair[];
  onUpdateDemonstration: (index: number, updated: DemonstrationPair) => void;
  testInput: number[][];
  onUpdateTestInput: (grid: number[][]) => void;
  predictionResult: PredictionResult;
  onRuleBroken: () => void;
  onResetTaskDefaults: () => void;
  onAddDemonstration?: () => void;
  onDeleteDemonstration?: (index: number) => void;
  onGenerateNewProblem?: () => void;
  expectedOutput?: number[][];
}

export function DemonstrationSandbox({
  currentTask,
  onSelectTask,
  allTasks,
  demoCount,
  setDemoCount,
  activeDemonstrations,
  onUpdateDemonstration,
  testInput,
  onUpdateTestInput,
  predictionResult,
  onRuleBroken,
  onResetTaskDefaults,
  onAddDemonstration,
  onDeleteDemonstration,
  onGenerateNewProblem,
  expectedOutput,
}: DemonstrationSandboxProps) {
  const [labMode, setLabMode] = useState<"grid" | "algebraic">("grid");
  const [isBreakModalOpen, setIsBreakModalOpen] = useState(false);
  const [activeTabCategory, setActiveTabCategory] = useState<"All" | "Easy" | "Medium" | "Tricky">(
    "All"
  );

  const filteredTasks =
    activeTabCategory === "All"
      ? allTasks
      : allTasks.filter((t) => t.category === activeTabCategory);

  const topRule = predictionResult.topHypotheses[0];

  // Compare prediction against ground truth
  const targetOutput = expectedOutput || currentTask.testCase.expectedOutput;
  let matchingCells = 0;
  const H = targetOutput.length;
  const W = targetOutput[0]?.length || 0;
  const totalCells = H * W;

  for (let r = 0; r < H; r++) {
    for (let c = 0; c < W; c++) {
      if (predictionResult.predictedGrid[r]?.[c] === targetOutput[r]?.[c]) {
        matchingCells++;
      }
    }
  }

  const isExactMatch = matchingCells === totalCells && totalCells > 0;
  const accuracyPct =
    totalCells > 0 ? Math.round((matchingCells / totalCells) * 1000) / 10 : 0;

  return (
    <section id="sandbox" className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono mb-1">
            <Layers className="h-4 w-4" />
            <span>Interactive Demo Lab (Winning Feature)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Interactive Demo Lab &amp; Real-Time Induction
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Add/edit/remove demonstrations, generate unseen problems, and observe how changes affect AI rule prediction.
          </p>
        </div>

        {/* Lab Mode Toggle & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center space-x-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setLabMode("grid")}
              className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 ${
                labMode === "grid"
                  ? "bg-cyan-500 text-slate-950 font-bold shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>ARC 2D Spatial Lab</span>
            </button>
            <button
              onClick={() => setLabMode("algebraic")}
              className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 ${
                labMode === "algebraic"
                  ? "bg-cyan-500 text-slate-950 font-bold shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Calculator className="h-3.5 w-3.5" />
              <span>Quick Algebraic Lab (Poster Preview)</span>
            </button>
          </div>

          <button
            onClick={onResetTaskDefaults}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition flex items-center space-x-1.5"
            title="Reset current task to default"
          >
            <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          <button
            onClick={() => setIsBreakModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-500/40 hover:border-red-500 transition shadow-sm flex items-center space-x-1.5"
          >
            <ShieldAlert className="h-4 w-4 text-red-400" />
            <span>&ldquo;Break the Rule&rdquo;</span>
          </button>
        </div>
      </div>

      {/* If Algebraic Demo Mode is active */}
      {labMode === "algebraic" ? (
        <AlgebraicDemoLab />
      ) : (
        /* Visual ARC Grid Lab */
        <div className="space-y-6">
          {/* Showcase Banner matching Poster UI Preview: AI Prediction | Ground Truth | Result | Learned Rule */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-cyan-500/40 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-xs uppercase font-mono tracking-wider text-cyan-400 font-bold">
                  Evaluation Scorecard:
                </span>
                <span className="text-sm font-bold text-white">{currentTask.name}</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono text-slate-400">Level:</span>
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                    currentTask.category === "Easy"
                      ? "bg-emerald-950/60 text-emerald-400 border-emerald-500/30"
                      : currentTask.category === "Medium"
                      ? "bg-amber-950/60 text-amber-400 border-amber-500/30"
                      : "bg-rose-950/60 text-rose-400 border-rose-500/30"
                  }`}
                >
                  {currentTask.category}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
              {/* AI Prediction Tile */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                  AI Prediction
                </span>
                <span className="text-base font-bold font-mono text-cyan-300">
                  {matchingCells}/{totalCells} Cells Match ({accuracyPct}%)
                </span>
              </div>

              {/* Ground Truth Tile */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                  Ground Truth
                </span>
                <span className="text-base font-bold font-mono text-white">
                  Target ARC Grid ({H}&times;{W})
                </span>
              </div>

              {/* Result Tile */}
              <div
                className={`p-3 rounded-xl border flex flex-col items-center justify-center ${
                  isExactMatch
                    ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
                    : "bg-rose-950/40 border-rose-500/40 text-rose-300"
                }`}
              >
                <span className="text-[10px] font-mono uppercase block mb-0.5">Result</span>
                <div className="flex items-center space-x-1.5 font-bold text-sm font-mono">
                  {isExactMatch ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span>Exact Match (Correct)</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-rose-400" />
                      <span>Mismatch Detected</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Learned Rule */}
            <div className="p-3 rounded-xl bg-slate-950/90 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold block">
                  Top Induced Rule:
                </span>
                <span className="font-mono text-xs sm:text-sm font-bold text-white">
                  {topRule ? topRule.name : "Evaluating..."} &bull;{" "}
                  <span className="text-cyan-400">
                    Confidence: {topRule ? `${topRule.confidence}%` : "0%"}
                  </span>
                </span>
              </div>
              <span className="text-xs text-slate-400">
                {topRule ? topRule.description : "No hypothesis synthesized yet."}
              </span>
            </div>
          </div>

          {/* Task Selector Bank */}
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Select from Curated ARC Task Bank:
              </span>

              {/* Category Tabs */}
              <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                {(["All", "Easy", "Medium", "Tricky"] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveTabCategory(cat)}
                    className={`px-2.5 py-1 rounded font-medium transition ${
                      activeTabCategory === cat
                        ? "bg-cyan-500 text-slate-950 font-bold"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Task Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {filteredTasks.map((t) => {
                const isSelected = t.id === currentTask.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => onSelectTask(t)}
                    className={`p-2.5 rounded-lg text-left border transition flex flex-col justify-between ${
                      isSelected
                        ? "bg-cyan-950/50 border-cyan-500/60 text-white shadow-sm ring-1 ring-cyan-500/30"
                        : "bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="font-semibold text-xs tracking-tight">{t.name}</span>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                          t.category === "Easy"
                            ? "bg-emerald-950/50 text-emerald-400 border-emerald-500/30"
                            : t.category === "Medium"
                            ? "bg-amber-950/50 text-amber-400 border-amber-500/30"
                            : "bg-purple-950/50 text-purple-400 border-purple-500/30"
                        }`}
                      >
                        {t.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{t.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Demonstration Density Slider & Add Demonstration Control */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Sliders className="h-4 w-4 text-indigo-400" />
                <span className="text-sm font-semibold text-white">
                  Demonstration Density:
                </span>
                <span className="text-xs font-bold font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                  {demoCount} of {activeDemonstrations.length} Pairs Active
                </span>
              </div>
              <p className="text-xs text-slate-400 max-w-xl">
                More demonstrations constrain the search space. Click any cell below to paint, or click &ldquo;+ Add Demonstration&rdquo; to supply another pair.
              </p>
            </div>

            <div className="flex items-center space-x-3 w-full md:w-auto">
              <input
                type="range"
                min={1}
                max={Math.max(1, activeDemonstrations.length)}
                step={1}
                value={demoCount}
                onChange={(e) => setDemoCount(Number(e.target.value))}
                className="w-full md:w-44 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />

              {onAddDemonstration && (
                <button
                  onClick={onAddDemonstration}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold bg-cyan-600 hover:bg-cyan-500 text-white flex items-center space-x-1 shrink-0 shadow transition"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Pair</span>
                </button>
              )}
            </div>
          </div>

          {/* Active Demonstration Pairs View */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-white flex items-center space-x-2">
                <span>Active Demonstration Pairs</span>
                <span className="text-xs font-mono text-slate-400">
                  (Click any cell to paint &amp; customize)
                </span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeDemonstrations.slice(0, demoCount).map((demo, idx) => (
                <div
                  key={demo.id || idx}
                  className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col space-y-3"
                >
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800/80 pb-2">
                    <span className="font-bold text-cyan-300">
                      Demonstration Pair #{idx + 1}
                    </span>

                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] text-slate-500">Paintable</span>
                      {onDeleteDemonstration && activeDemonstrations.length > 1 && (
                        <button
                          onClick={() => onDeleteDemonstration(idx)}
                          className="text-slate-500 hover:text-rose-400 transition p-0.5"
                          title="Delete this demonstration pair"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-3">
                    <div className="flex flex-col items-center">
                      <GridEditor
                        grid={demo.input}
                        onChange={(newInput) =>
                          onUpdateDemonstration(idx, { ...demo, input: newInput })
                        }
                        title="Input"
                        size="sm"
                      />
                    </div>

                    <div className="flex flex-col items-center text-slate-500 shrink-0">
                      <ArrowRight className="h-5 w-5 text-indigo-400" />
                      <span className="text-[10px] font-mono mt-1 text-slate-400">Yields</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <GridEditor
                        grid={demo.output}
                        onChange={(newOutput) =>
                          onUpdateDemonstration(idx, { ...demo, output: newOutput })
                        }
                        title="Output"
                        size="sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Test Case Canvas with "Generate New Problem" button */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-indigo-500/30 shadow-lg shadow-indigo-950/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs uppercase font-mono tracking-wider text-indigo-400 font-bold block mb-0.5">
                  Unseen Evaluation Grid
                </span>
                <h3 className="text-lg font-bold text-white">
                  Test Input &amp; Live Symbolic Prediction
                </h3>
                <p className="text-xs text-slate-400">
                  The rule induction engine uses its top hypothesis to deduce the output for this unseen test input.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                {onGenerateNewProblem && (
                  <button
                    onClick={onGenerateNewProblem}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center space-x-1.5 shadow transition"
                  >
                    <Dice5 className="h-4 w-4" />
                    <span>Generate New Problem</span>
                  </button>
                )}
                <span className="text-xs font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2 py-1 rounded">
                  {topRule ? topRule.name : "None"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              {/* Test Input Editor */}
              <div className="flex flex-col items-center">
                <GridEditor
                  grid={testInput}
                  onChange={onUpdateTestInput}
                  title="Test Input Grid (Editable / Paintable)"
                  size="md"
                  allowResize={true}
                />
              </div>

              {/* Predicted Output */}
              <div className="flex flex-col items-center">
                <GridEditor
                  grid={predictionResult.predictedGrid}
                  title="Predicted Output Grid (Client Synthesizer)"
                  isReadOnly={true}
                  size="md"
                  confidenceGrid={predictionResult.confidenceGrid}
                  showConfidence={true}
                />
                <div className="text-[11px] text-slate-400 mt-2 flex items-center space-x-2 font-mono">
                  <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Numbers in cells show cell-by-cell confidence %</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Adversarial Modal */}
      <BreakTheRuleModal
        isOpen={isBreakModalOpen}
        onClose={() => setIsBreakModalOpen(false)}
        task={currentTask}
        topHypothesis={topRule}
        onRuleBroken={onRuleBroken}
      />
    </section>
  );
}
