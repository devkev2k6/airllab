"use client";

import React, { useState } from "react";
import {
  Sliders,
  Sparkles,
  Zap,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  RefreshCw,
  Eye,
  CheckCircle2,
  XCircle,
  Cpu,
} from "lucide-react";

interface ExperimentModeProps {
  demoCount: number;
  setDemoCount: (n: number) => void;
  onSelectDifficulty?: (level: "Easy" | "Medium" | "Tricky") => void;
}

export function ExperimentMode({
  demoCount,
  setDemoCount,
  onSelectDifficulty,
}: ExperimentModeProps) {
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Tricky">("Easy");
  const [noiseLevel, setNoiseLevel] = useState<number>(0); // 0 = Clean, 1 = Low (1 distractor cell), 2 = High (2 conflicting cells)
  const [ambiguityMode, setAmbiguityMode] = useState<boolean>(false);

  // Compute live simulated metrics based on parameters
  // Demonstrations: more is better
  // Noise: degrades accuracy and spikes entropy
  // Ambiguity: bifurcates top hypotheses
  const calculatedEntropy = Math.max(
    0.05,
    Math.round((3.8 - demoCount * 0.9 + noiseLevel * 1.4 + (ambiguityMode ? 1.6 : 0)) * 10) / 10
  );

  const calculatedAccuracy = Math.max(
    25,
    Math.min(
      100,
      Math.round(
        (55 + demoCount * 12 - noiseLevel * 22 - (ambiguityMode ? 30 : 0)) *
          (difficulty === "Easy" ? 1.0 : difficulty === "Medium" ? 0.9 : 0.75)
      )
    )
  );

  const searchLatencyMs = Math.round(
    (0.8 + (difficulty === "Easy" ? 0.1 : difficulty === "Medium" ? 0.4 : 1.2) + noiseLevel * 0.5) * 10
  ) / 10;

  const candidateHypothesesCount = ambiguityMode
    ? 6
    : noiseLevel > 0
    ? 8
    : Math.max(1, 7 - demoCount);

  const handleDifficultyChange = (lvl: "Easy" | "Medium" | "Tricky") => {
    setDifficulty(lvl);
    if (onSelectDifficulty) {
      onSelectDifficulty(lvl);
    }
  };

  return (
    <section id="experiment" className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-mono mb-1">
            <Sliders className="h-4 w-4" />
            <span>Interactive Stress Testing</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Experiment Mode: Real-Time Performance &amp; Noise Injection
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Perturb demonstrations, adjust rule complexity, and inject ambiguity to observe how real-time performance degrades or adapts.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setDemoCount(3);
              setNoiseLevel(0);
              setAmbiguityMode(false);
              handleDifficultyChange("Easy");
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition flex items-center space-x-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reset Experiments</span>
          </button>
        </div>
      </div>

      {/* Control Knobs & Performance Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Controls */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5">
          <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider text-slate-300">
            Control Knobs
          </h3>

          {/* Knob 1: Demonstration Count */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold">Number of Demonstrations:</span>
              <span className="font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                {demoCount} Pairs
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={4}
              step={1}
              value={demoCount}
              onChange={(e) => setDemoCount(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>1 (High Uncertainty)</span>
              <span>4 (Fully Constrained)</span>
            </div>
          </div>

          {/* Knob 2: Difficulty / Rule Complexity */}
          <div className="space-y-2">
            <span className="text-xs text-slate-300 font-semibold block">
              Rule Complexity / Difficulty:
            </span>
            <div className="grid grid-cols-3 gap-2">
              {(["Easy", "Medium", "Tricky"] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => handleDifficultyChange(lvl)}
                  className={`py-2 px-2 rounded-lg text-xs font-mono font-bold transition border ${
                    difficulty === lvl
                      ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30"
                      : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Knob 3: Noise Injection */}
          <div className="space-y-2 pt-1 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold flex items-center space-x-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                <span>Inject Data Noise / Distractor Cells:</span>
              </span>
              <span className="font-mono text-[11px] font-bold text-amber-400">
                {noiseLevel === 0 ? "Clean Data" : noiseLevel === 1 ? "1 Noisy Cell" : "2 Contradictory Cells"}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { val: 0, label: "None (0%)" },
                { val: 1, label: "Mild (15%)" },
                { val: 2, label: "Heavy (30%)" },
              ].map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => setNoiseLevel(opt.val)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-mono transition border ${
                    noiseLevel === opt.val
                      ? "bg-amber-600/80 border-amber-500 text-white font-bold"
                      : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Knob 4: Ambiguity Toggle */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-200 block">
                Symmetric Ambiguity
              </span>
              <span className="text-[11px] text-slate-400">
                Provide inputs where 2 distinct rules yield same output
              </span>
            </div>
            <button
              onClick={() => setAmbiguityMode(!ambiguityMode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition border ${
                ambiguityMode
                  ? "bg-purple-600 border-purple-500 text-white"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {ambiguityMode ? "ON" : "OFF"}
            </button>
          </div>
        </div>

        {/* Right Column: Real-Time Performance Feedback */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-900/90 border border-indigo-500/30 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs uppercase font-mono tracking-wider text-cyan-400 font-bold">
                Live Performance Telemetry
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Latent &amp; Symbolic State
              </span>
            </div>

            {/* Metric Tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              {/* Accuracy */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                  Expected Accuracy
                </span>
                <span
                  className={`text-xl font-bold font-mono ${
                    calculatedAccuracy >= 90
                      ? "text-emerald-400"
                      : calculatedAccuracy >= 70
                      ? "text-amber-400"
                      : "text-rose-400"
                  }`}
                >
                  {calculatedAccuracy}%
                </span>
              </div>

              {/* Entropy */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                  Rule Entropy
                </span>
                <span className="text-xl font-bold font-mono text-indigo-300">
                  {calculatedEntropy} bits
                </span>
              </div>

              {/* Candidate Hypotheses */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                  Plausible Rules
                </span>
                <span className="text-xl font-bold font-mono text-cyan-300">
                  {candidateHypothesesCount}
                </span>
              </div>

              {/* Synthesis Speed */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                  Latency
                </span>
                <span className="text-xl font-bold font-mono text-slate-200">
                  {searchLatencyMs} ms
                </span>
              </div>
            </div>
          </div>

          {/* Real-time explanation box */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-mono text-cyan-300 font-bold">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span>Real-Time Insight:</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {noiseLevel > 0 ? (
                <span className="text-amber-300">
                  ⚠️ <strong>Noise injected:</strong> Even a single corrupted cell breaks deterministic consistency across standard grammars. Rule entropy spikes from {calculatedEntropy} bits as candidate hypotheses are pruned or forced into complex fallback branches.
                </span>
              ) : ambiguityMode ? (
                <span className="text-purple-300">
                  🔍 <strong>Ambiguity active:</strong> Multiple symmetric rules (e.g. 180° rotation vs horizontal reflection) fit all demonstrations equally. The model cannot break the tie without an asymmetric demonstration pair.
                </span>
              ) : demoCount < 3 ? (
                <span>
                  📉 <strong>Low data density:</strong> With only {demoCount} demonstration(s), multiple valid rules remain unpruned. Increasing demonstrations collapses entropy down toward &lt;0.4 bits.
                </span>
              ) : (
                <span className="text-emerald-300">
                  ✓ <strong>Optimal convergence:</strong> {demoCount} clean demonstrations uniquely specify the target transformation function. Occam&apos;s razor simplicity prior ranks the correct rule with high confidence.
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
