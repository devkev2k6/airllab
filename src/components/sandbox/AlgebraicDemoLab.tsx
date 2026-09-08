"use client";

import React, { useState, useMemo } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  HelpCircle,
} from "lucide-react";

interface Demonstration {
  id: number;
  input: number;
  output: number;
}

export function AlgebraicDemoLab() {
  const [level, setLevel] = useState<"Easy" | "Medium" | "Hard">("Easy");

  // Initial demonstrations matching poster: 1 -> 4, 2 -> 6, 3 -> 8 (Rule: 2x + 2)
  const [demonstrations, setDemonstrations] = useState<Demonstration[]>([
    { id: 1, input: 1, output: 4 },
    { id: 2, input: 2, output: 6 },
    { id: 3, input: 3, output: 8 },
  ]);

  const [testInput, setTestInput] = useState<number>(7);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editInputVal, setEditInputVal] = useState<number>(1);
  const [editOutputVal, setEditOutputVal] = useState<number>(4);

  // Ground truth rule generator based on selected level
  // Easy: y = 2x + 2
  // Medium: y = 3x - 1
  // Hard: y = x^2 + 1
  const groundTruthFn = useMemo(() => {
    if (level === "Easy") return (x: number) => 2 * x + 2;
    if (level === "Medium") return (x: number) => 3 * x - 1;
    return (x: number) => x * x + 1;
  }, [level]);

  // Symbolic learner: finds linear f(x) = ax + b or quadratic f(x) = ax^2 + b
  const learnedRule = useMemo(() => {
    if (demonstrations.length === 0) {
      return {
        formula: "No demonstrations provided",
        predict: (x: number) => 0,
        explanation: "Supply at least 2 demonstrations to deduce coefficients.",
        isConfident: false,
      };
    }

    if (demonstrations.length === 1) {
      const d = demonstrations[0];
      const factor = d.input !== 0 ? d.output / d.input : 1;
      return {
        formula: `f(x) = ${factor.toFixed(1)} * x (Underdetermined: 1 example)`,
        predict: (x: number) => Math.round(factor * x),
        explanation: "Only 1 demonstration provided. Many infinite functions could fit!",
        isConfident: false,
      };
    }

    // Try linear regression / slope fit
    const d0 = demonstrations[0];
    const d1 = demonstrations[1];
    const dx = d1.input - d0.input;
    const dy = d1.output - d0.output;

    if (dx !== 0) {
      const slope = dy / dx;
      const intercept = d0.output - slope * d0.input;

      // Check if all other demonstrations fit
      const allFitLinear = demonstrations.every(
        (d) => Math.abs(slope * d.input + intercept - d.output) < 0.001
      );

      if (allFitLinear) {
        const sign = intercept >= 0 ? `+ ${intercept}` : `- ${Math.abs(intercept)}`;
        return {
          formula: `f(x) = ${slope}x ${intercept !== 0 ? sign : ""}`.trim(),
          predict: (x: number) => Math.round(slope * x + intercept),
          explanation: `Consistent linear relationship discovered with slope=${slope}, offset=${intercept}.`,
          isConfident: true,
        };
      }
    }

    // Try quadratic f(x) = a x^2 + c
    if (demonstrations.length >= 2) {
      const d0 = demonstrations[0];
      const d1 = demonstrations[1];
      const dx2 = d1.input * d1.input - d0.input * d0.input;
      const dy = d1.output - d0.output;
      if (dx2 !== 0) {
        const a = dy / dx2;
        const c = d0.output - a * d0.input * d0.input;
        const allFitQuad = demonstrations.every(
          (d) => Math.abs(a * d.input * d.input + c - d.output) < 0.001
        );
        if (allFitQuad) {
          return {
            formula: `f(x) = ${a}x² + ${c}`,
            predict: (x: number) => Math.round(a * x * x + c),
            explanation: "Non-linear quadratic relation induced across demonstrations.",
            isConfident: true,
          };
        }
      }
    }

    // Inconsistent / Noisy demonstrations
    return {
      formula: "No consistent polynomial rule found (Contradiction / Noise)",
      predict: (x: number) => demonstrations[0].output,
      explanation: "Demonstrations conflict with standard affine/polynomial hypotheses.",
      isConfident: false,
    };
  }, [demonstrations]);

  const aiPrediction = learnedRule.predict(testInput);
  const groundTruth = groundTruthFn(testInput);
  const isCorrect = aiPrediction === groundTruth;

  // Add new demonstration
  const handleAddExample = () => {
    const nextInput = demonstrations.length + 1;
    const nextOutput = groundTruthFn(nextInput);
    setDemonstrations((prev) => [
      ...prev,
      { id: Date.now(), input: nextInput, output: nextOutput },
    ]);
  };

  // Delete demonstration
  const handleDeleteExample = (id: number) => {
    setDemonstrations((prev) => prev.filter((d) => d.id !== id));
  };

  // Save edit
  const handleSaveEdit = (id: number) => {
    setDemonstrations((prev) =>
      prev.map((d) => (d.id === id ? { ...d, input: editInputVal, output: editOutputVal } : d))
    );
    setEditingId(null);
  };

  // Generate new unseen test input
  const handleGenerateNewProblem = () => {
    const randomInput = Math.floor(Math.random() * 15) + 4;
    setTestInput(randomInput);
  };

  // Switch difficulty level preset
  const handleSwitchLevel = (newLevel: "Easy" | "Medium" | "Hard") => {
    setLevel(newLevel);
    let fn = (x: number) => 2 * x + 2;
    if (newLevel === "Medium") fn = (x: number) => 3 * x - 1;
    if (newLevel === "Hard") fn = (x: number) => x * x + 1;

    setDemonstrations([
      { id: 1, input: 1, output: fn(1) },
      { id: 2, input: 2, output: fn(2) },
      { id: 3, input: 3, output: fn(3) },
    ]);
    setTestInput(7);
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/40 shadow-xl shadow-cyan-950/30 space-y-5">
      {/* Header matching poster UI Preview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
            ⚡
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <span>Interactive Demo Lab (Fast Symbolic Induction)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Live mathematical induction: add/edit/delete examples, generate novel inputs, and observe rule convergence.
            </p>
          </div>
        </div>

        {/* Level Indicator & Switcher */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono text-slate-400">Difficulty:</span>
          {(["Easy", "Medium", "Hard"] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => handleSwitchLevel(lvl)}
              className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition ${
                level === lvl
                  ? "bg-cyan-500 text-slate-950 shadow"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Demonstrations on left, New Problem on right */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Demonstrations List */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400 font-bold">
              Demonstrations ({demonstrations.length} Active):
            </span>
            <button
              onClick={handleAddExample}
              className="px-2.5 py-1 rounded-md text-xs font-medium bg-cyan-600 hover:bg-cyan-500 text-white flex items-center space-x-1 shadow transition"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Example</span>
            </button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {demonstrations.length === 0 && (
              <div className="text-xs text-slate-500 py-4 text-center">
                No demonstrations. Click &ldquo;Add Example&rdquo; above!
              </div>
            )}
            {demonstrations.map((demo) => {
              const isEditing = editingId === demo.id;
              return (
                <div
                  key={demo.id}
                  className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-mono"
                >
                  {isEditing ? (
                    <div className="flex items-center space-x-2 w-full">
                      <input
                        type="number"
                        value={editInputVal}
                        onChange={(e) => setEditInputVal(Number(e.target.value))}
                        className="w-16 px-1.5 py-0.5 rounded bg-slate-950 border border-slate-700 text-white text-center"
                      />
                      <span>&rarr;</span>
                      <input
                        type="number"
                        value={editOutputVal}
                        onChange={(e) => setEditOutputVal(Number(e.target.value))}
                        className="w-16 px-1.5 py-0.5 rounded bg-slate-950 border border-slate-700 text-white text-center"
                      />
                      <button
                        onClick={() => handleSaveEdit(demo.id)}
                        className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[11px]"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center space-x-2 text-slate-200">
                        <span className="font-bold text-cyan-400">{demo.input}</span>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
                        <span className="font-bold text-indigo-400">{demo.output}</span>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => {
                            setEditingId(demo.id);
                            setEditInputVal(demo.input);
                            setEditOutputVal(demo.output);
                          }}
                          className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
                          title="Edit this pair"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteExample(demo.id)}
                          className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                          title="Delete this pair"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* New Problem Input & Generator */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase text-slate-400 font-bold">
                New Unseen Problem:
              </span>
              <button
                onClick={handleGenerateNewProblem}
                className="px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white flex items-center space-x-1 shadow transition"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Generate New</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center space-x-4">
              <div className="text-center">
                <span className="text-[10px] font-mono text-slate-500 block">Input</span>
                <span className="text-2xl sm:text-3xl font-bold font-mono text-white">
                  {testInput}
                </span>
              </div>
              <ArrowRight className="h-6 w-6 text-cyan-400" />
              <div className="text-center">
                <span className="text-[10px] font-mono text-slate-500 block">Output ?</span>
                <span className="text-2xl sm:text-3xl font-bold font-mono text-cyan-300">
                  {aiPrediction}
                </span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 font-mono flex items-center space-x-1.5">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
            <span>AI infers rule live and evaluates unseen input instantly.</span>
          </div>
        </div>
      </div>

      {/* Comparison Results Card matching Poster Preview */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          {/* AI Prediction */}
          <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 uppercase block mb-1">
              AI Prediction
            </span>
            <span className="text-xl font-bold font-mono text-cyan-300">{aiPrediction}</span>
          </div>

          {/* Ground Truth */}
          <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 uppercase block mb-1">
              Ground Truth
            </span>
            <span className="text-xl font-bold font-mono text-white">{groundTruth}</span>
          </div>

          {/* Result */}
          <div
            className={`p-3 rounded-lg border flex flex-col items-center justify-center ${
              isCorrect
                ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
                : "bg-rose-950/40 border-rose-500/40 text-rose-300"
            }`}
          >
            <span className="text-[11px] font-mono uppercase block mb-1">Result</span>
            <div className="flex items-center space-x-1 font-bold text-base font-mono">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Correct</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-rose-400" />
                  <span>Wrong</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Learned Rule Card */}
        <div className="p-3 rounded-lg bg-slate-900/90 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-400 font-bold block">
              Learned Rule:
            </span>
            <span className="font-mono text-sm font-bold text-white">{learnedRule.formula}</span>
          </div>
          <span className="text-xs text-slate-400">{learnedRule.explanation}</span>
        </div>
      </div>
    </div>
  );
}
