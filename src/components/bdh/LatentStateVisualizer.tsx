"use client";

import React, { useState } from "react";
import { BdhLatentStep } from "@/lib/arc/types";
import { generateLatentSteps } from "@/lib/bdh/bdh-model";
import {
  Brain,
  Sparkles,
  ArrowRight,
  Activity,
  Layers,
  Database,
  ShieldCheck,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

interface LatentStateVisualizerProps {
  taskName: string;
  demoCount: number;
  onExploreCompleted?: () => void;
}

export function LatentStateVisualizer({
  taskName,
  demoCount,
  onExploreCompleted,
}: LatentStateVisualizerProps) {
  const steps = generateLatentSteps(taskName, demoCount);
  const [activeStepIdx, setActiveStepIdx] = useState(0);

  const currentStep = steps[activeStepIdx] || steps[0];

  const handleSelectStep = (idx: number) => {
    setActiveStepIdx(idx);
    if (idx === steps.length - 1 && onExploreCompleted) {
      onExploreCompleted();
    }
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-purple-500/40 p-5 space-y-6 shadow-xl shadow-purple-950/30">
      {/* Visual Mathematical Formula Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-purple-400 text-xs font-mono mb-1">
            <Brain className="h-4 w-4" />
            <span>Recurrent Latent State Accumulator</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Associative Memory Digestion Pipeline
          </h3>
          <p className="text-xs text-slate-400">
            Sequential state update without expanding context window or adjusting model weights.
          </p>
        </div>

        {/* Mathematical Expression Banner */}
        <div className="bg-slate-950 px-4 py-2.5 rounded-xl border border-purple-500/30 text-xs font-mono text-purple-300 flex items-center space-x-2">
          <span className="text-slate-500">Recurrence:</span>
          <span className="font-bold text-sm bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Sₖ = U(Sₖ₋₁, Dₖ)
          </span>
        </div>
      </div>

      {/* Node Accumulator Stepper Graph */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[560px] gap-2">
          {steps.map((step, idx) => {
            const isActive = idx === activeStepIdx;
            const isCompleted = idx < activeStepIdx;

            return (
              <React.Fragment key={idx}>
                {/* Node Button */}
                <button
                  onClick={() => handleSelectStep(idx)}
                  className={`flex flex-col items-center p-2.5 rounded-xl border transition-all text-center flex-1 min-w-[100px] ${
                    isActive
                      ? "bg-purple-950/60 border-purple-400 text-white ring-2 ring-purple-500/50 shadow-lg shadow-purple-950/60 scale-105"
                      : isCompleted
                      ? "bg-slate-900/90 border-slate-700 text-purple-300 hover:border-purple-500/50"
                      : "bg-slate-900/40 border-slate-800 text-slate-500 hover:border-slate-700"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono mb-1.5 ${
                      isActive
                        ? "bg-gradient-to-tr from-purple-500 to-cyan-400 text-slate-950"
                        : isCompleted
                        ? "bg-purple-900/60 text-purple-300 border border-purple-500/30"
                        : "bg-slate-800 text-slate-500"
                    }`}
                  >
                    {idx === steps.length - 1 ? "Q" : `S${idx}`}
                  </div>
                  <span className="text-xs font-bold font-mono truncate w-full">
                    {idx === 0 ? "Prior S₀" : idx === steps.length - 1 ? "Query" : `+ Demo ${idx}`}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                    H = {step.entropy.toFixed(2)}
                  </span>
                </button>

                {/* Arrow Divider */}
                {idx < steps.length - 1 && (
                  <div className="text-slate-600 px-1 shrink-0">
                    <ArrowRight className="h-4 w-4 text-purple-500/60" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Step Detail & Vector Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-slate-950/80 p-5 rounded-xl border border-slate-800">
        {/* Left: Step Description & Dynamics */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono tracking-wider text-purple-400 font-bold">
              Current Latent State
            </span>
            <span className="text-xs font-mono text-slate-400">
              Step {activeStepIdx + 1} of {steps.length}
            </span>
          </div>

          <h4 className="text-lg font-bold text-white flex items-center space-x-2">
            <span>{currentStep.label}</span>
          </h4>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {currentStep.description}
          </p>

          {/* Converged Invariant Features */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-mono text-slate-400 block uppercase">
              Accumulated Invariant Manifolds:
            </span>
            <div className="space-y-1">
              {currentStep.convergedFeatures.map((feat, fIdx) => (
                <div
                  key={fIdx}
                  className="flex items-center space-x-2 text-xs text-purple-200 bg-purple-950/40 px-2.5 py-1 rounded border border-purple-500/20"
                >
                  <Sparkles className="h-3 w-3 text-cyan-400 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Controls to step forward/backward */}
          <div className="flex items-center space-x-2 pt-2">
            <button
              onClick={() => handleSelectStep(Math.max(0, activeStepIdx - 1))}
              disabled={activeStepIdx === 0}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none transition"
            >
              Previous State
            </button>
            <button
              onClick={() => handleSelectStep(Math.min(steps.length - 1, activeStepIdx + 1))}
              disabled={activeStepIdx === steps.length - 1}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 disabled:pointer-events-none transition flex items-center space-x-1"
            >
              <span>Next Demonstration</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Latent Vector Heatmap & Associative Energy */}
        <div className="space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-mono tracking-wider text-cyan-400 font-bold">
                Latent Activation Heatmap (16-D Subspace)
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                ||Sₖ|| = {currentStep.associativeMagnitude.toFixed(2)}
              </span>
            </div>

            {/* Heatmap Grid */}
            <div className="grid grid-cols-8 gap-1.5 p-3 rounded-xl bg-slate-900 border border-slate-800">
              {currentStep.latentVector.map((val, vIdx) => {
                const intensity = Math.min(100, Math.round(val * 100));
                return (
                  <div
                    key={vIdx}
                    title={`Dimension ${vIdx}: ${val.toFixed(2)}`}
                    className="flex flex-col items-center justify-center h-12 rounded-lg border border-purple-500/20 transition-all font-mono text-[10px]"
                    style={{
                      backgroundColor: `rgba(168, 85, 247, ${Math.max(0.1, val)})`,
                      color: val > 0.4 ? "#ffffff" : "#cbd5e1",
                    }}
                  >
                    <span className="text-[9px] opacity-70">d{vIdx}</span>
                    <span className="font-bold">{val.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Uncertainty Entropy Gauge */}
          <div className="space-y-2 p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Latent Entropy H(Rule | D₁..ₖ):</span>
              <span className="text-amber-400 font-bold">{currentStep.entropy.toFixed(2)} bits</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 transition-all duration-300"
                style={{ width: `${Math.min(100, (currentStep.entropy / 4.0) * 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span>Low Entropy (Certain)</span>
              <span>High Entropy (Ambiguous)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Literature Disclaimer Note */}
      <div className="p-3 rounded-lg bg-slate-950/90 border border-slate-800 text-[11px] text-slate-400 font-mono flex items-start space-x-2">
        <Info className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-300">Literature Citation &amp; Boundary:</strong> Exact internal update operator equations U(·) remain undisclosed in Pathway&rsquo;s primary literature. This visualization reflects the published mathematical architecture of recurrent associative accumulation in a 150M parameter model without inference-time parameter updates.
        </div>
      </div>
    </div>
  );
}

function Info(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}
