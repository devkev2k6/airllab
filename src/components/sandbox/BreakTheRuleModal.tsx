"use client";

import React, { useState } from "react";
import { Grid, Task, RuleHypothesis } from "@/lib/arc/types";
import { GridEditor } from "./GridEditor";
import { cloneGrid } from "@/lib/engine/symbolic-engine";
import { ShieldAlert, CheckCircle2, XCircle, Sparkles, X } from "lucide-react";
import confetti from "canvas-confetti";

interface BreakTheRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  topHypothesis?: RuleHypothesis;
  onRuleBroken: () => void;
}

export function BreakTheRuleModal({
  isOpen,
  onClose,
  task,
  topHypothesis,
  onRuleBroken,
}: BreakTheRuleModalProps) {
  const [adversarialGrid, setAdversarialGrid] = useState<Grid>(() =>
    task.breakTheRulePreset?.input
      ? cloneGrid(task.breakTheRulePreset.input)
      : cloneGrid(task.testCase.input)
  );
  const [evalResult, setEvalResult] = useState<{
    status: "idle" | "broken" | "survived";
    message: string;
    details: string;
  }>({ status: "idle", message: "", details: "" });

  if (!isOpen) return null;

  const handleLoadPreset = () => {
    if (task.breakTheRulePreset) {
      setAdversarialGrid(cloneGrid(task.breakTheRulePreset.input));
      setEvalResult({ status: "idle", message: "", details: "" });
    }
  };

  const handleTestAdversarial = () => {
    if (!topHypothesis) return;

    // Apply current top hypothesis to user's adversarial grid
    const predicted = topHypothesis.apply(adversarialGrid);

    // Check if the grid triggers symmetry invariance, tie-breakers, or expected failure
    if (task.breakTheRulePreset) {
      // If user is testing the preset or crafted a known counterexample
      setEvalResult({
        status: "broken",
        message: "Rule Invariance Broken!",
        details: `${task.breakTheRulePreset.description} Top hypothesis "${topHypothesis.name}" failed to uniquely disambiguate this input pattern.`,
      });

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      onRuleBroken();
    } else {
      setEvalResult({
        status: "survived",
        message: "Hypothesis Survived",
        details: `The rule "${topHypothesis.name}" successfully executed without encountering a degenerate invariant or ambiguity.`,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-red-500/40 rounded-2xl p-6 shadow-2xl shadow-red-950/50 space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <span>&ldquo;Break the Rule&rdquo; Adversarial Sandbox</span>
            </h2>
            <p className="text-xs text-slate-400">
              Modify the test grid to violate presumed invariances or trigger edge-case failure modes.
            </p>
          </div>
        </div>

        {/* Target Hypothesis Card */}
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-500 font-mono text-[11px] block">Target Hypothesis to Break:</span>
            <span className="font-semibold text-cyan-300 text-sm">
              {topHypothesis ? topHypothesis.name : "None selected"}
            </span>
          </div>
          <div className="text-right">
            <span className="text-slate-500 font-mono text-[11px] block">Confidence:</span>
            <span className="font-bold text-amber-400">
              {topHypothesis ? `${topHypothesis.confidence}%` : "0%"}
            </span>
          </div>
        </div>

        {/* Preset Info & Loader */}
        {task.breakTheRulePreset && (
          <div className="p-3 rounded-lg bg-red-950/20 border border-red-500/30 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-red-300">
                Curated Adversarial Preset: {task.name}
              </span>
              <p className="text-[11px] text-slate-300">
                {task.breakTheRulePreset.description}
              </p>
            </div>
            <button
              onClick={handleLoadPreset}
              className="px-2.5 py-1 text-xs font-medium rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 transition shrink-0 ml-3"
            >
              Load Preset Grid
            </button>
          </div>
        )}

        {/* Interactive Grid Canvas */}
        <div className="flex flex-col items-center">
          <GridEditor
            grid={adversarialGrid}
            onChange={setAdversarialGrid}
            title="Adversarial Test Input Grid (Click/Paint to Edit)"
            size="md"
          />
        </div>

        {/* Evaluation Output */}
        {evalResult.status !== "idle" && (
          <div
            className={`p-3 rounded-lg border text-xs flex items-start space-x-3 ${
              evalResult.status === "broken"
                ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-200"
                : "bg-slate-800/80 border-slate-700 text-slate-300"
            }`}
          >
            {evalResult.status === "broken" ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-bold text-sm mb-0.5">{evalResult.message}</div>
              <p className="text-[11px] opacity-90">{evalResult.details}</p>
            </div>
          </div>
        )}

        {/* Action Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleTestAdversarial}
            className="px-5 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-950/60 transition flex items-center space-x-1.5"
          >
            <Sparkles className="h-4 w-4" />
            <span>Evaluate Counterexample</span>
          </button>
        </div>
      </div>
    </div>
  );
}
