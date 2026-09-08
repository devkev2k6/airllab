"use client";

import React, { useState } from "react";
import {
  Trophy,
  Swords,
  User,
  Bot,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  RotateCw,
  Flame,
  HelpCircle,
} from "lucide-react";
import { GridEditor } from "../sandbox/GridEditor";
import { Grid } from "@/lib/arc/types";
import confetti from "canvas-confetti";

interface ChallengeRound {
  id: string;
  name: string;
  difficulty: "Easy" | "Medium" | "Tricky";
  ruleName: string;
  demonstrations: { input: Grid; output: Grid }[];
  testInput: Grid;
  groundTruth: Grid;
  aiPredicted: Grid;
  aiConfidence: number;
  options: {
    id: number;
    grid: Grid;
    label: string;
    isCorrect: boolean;
  }[];
  explanation: string;
}

const CHALLENGE_ROUNDS: ChallengeRound[] = [
  {
    id: "round-1",
    name: "Challenge 1: Rotational Symmetry & Color Shift",
    difficulty: "Easy",
    ruleName: "90° Clockwise Rotation + Recolor Blue to Green",
    demonstrations: [
      {
        input: [
          [1, 0],
          [0, 0],
        ],
        output: [
          [0, 3],
          [0, 0],
        ],
      },
      {
        input: [
          [0, 1],
          [0, 0],
        ],
        output: [
          [0, 0],
          [0, 3],
        ],
      },
    ],
    testInput: [
      [1, 1],
      [0, 0],
    ],
    groundTruth: [
      [0, 3],
      [0, 3],
    ],
    aiPredicted: [
      [0, 3],
      [0, 3],
    ],
    aiConfidence: 96.5,
    options: [
      {
        id: 1,
        grid: [
          [0, 3],
          [0, 3],
        ],
        label: "Option A (Rotate 90° + Green)",
        isCorrect: true,
      },
      {
        id: 2,
        grid: [
          [3, 3],
          [0, 0],
        ],
        label: "Option B (Recolor Only)",
        isCorrect: false,
      },
      {
        id: 3,
        grid: [
          [0, 1],
          [0, 1],
        ],
        label: "Option C (Rotate 90° Blue)",
        isCorrect: false,
      },
      {
        id: 4,
        grid: [
          [3, 0],
          [3, 0],
        ],
        label: "Option D (Rotate 270°)",
        isCorrect: false,
      },
    ],
    explanation:
      "Every demonstration rotates the grid 90° clockwise and transforms Blue (1) into Green (3). On input [[1, 1], [0, 0]], 90° rotation moves the top row to the right column, yielding [[0, 3], [0, 3]].",
  },
  {
    id: "round-2",
    name: "Challenge 2: Diagonal Transposition & Inversion",
    difficulty: "Medium",
    ruleName: "Transpose along Main Diagonal (r, c) -> (c, r)",
    demonstrations: [
      {
        input: [
          [2, 0, 0],
          [0, 0, 0],
          [0, 0, 0],
        ],
        output: [
          [2, 0, 0],
          [0, 0, 0],
          [0, 0, 0],
        ],
      },
      {
        input: [
          [0, 4, 0],
          [0, 0, 0],
          [0, 0, 0],
        ],
        output: [
          [0, 0, 0],
          [4, 0, 0],
          [0, 0, 0],
        ],
      },
    ],
    testInput: [
      [0, 0, 7],
      [0, 0, 0],
      [0, 0, 0],
    ],
    groundTruth: [
      [0, 0, 0],
      [0, 0, 0],
      [7, 0, 0],
    ],
    aiPredicted: [
      [0, 0, 0],
      [0, 0, 0],
      [7, 0, 0],
    ],
    aiConfidence: 94.2,
    options: [
      {
        id: 1,
        grid: [
          [0, 0, 0],
          [0, 0, 0],
          [7, 0, 0],
        ],
        label: "Option A (Diagonal Transpose)",
        isCorrect: true,
      },
      {
        id: 2,
        grid: [
          [7, 0, 0],
          [0, 0, 0],
          [0, 0, 0],
        ],
        label: "Option B (Horizontal Flip)",
        isCorrect: false,
      },
      {
        id: 3,
        grid: [
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 7],
        ],
        label: "Option C (Vertical Drop)",
        isCorrect: false,
      },
      {
        id: 4,
        grid: [
          [0, 7, 0],
          [0, 0, 0],
          [0, 0, 0],
        ],
        label: "Option D (Shift Left)",
        isCorrect: false,
      },
    ],
    explanation:
      "Demo 2 maps cell at (0, 1) to (1, 0). The underlying operation is matrix transposition. For test input with Orange (7) at (0, 2), transposition maps it to (2, 0).",
  },
  {
    id: "round-3",
    name: "Challenge 3: Adversarial Ambiguity Trap",
    difficulty: "Tricky",
    ruleName: "Vertical Reflection vs Gravity Drop",
    demonstrations: [
      {
        input: [
          [6, 6],
          [0, 0],
        ],
        output: [
          [0, 0],
          [6, 6],
        ],
      },
    ],
    testInput: [
      [0, 0],
      [6, 0],
    ],
    groundTruth: [
      [6, 0],
      [0, 0],
    ], // Intended rule: Vertical Flip
    aiPredicted: [
      [0, 0],
      [6, 0],
    ], // AI got tricked by gravity bias
    aiConfidence: 61.0,
    options: [
      {
        id: 1,
        grid: [
          [6, 0],
          [0, 0],
        ],
        label: "Option A (Flip Vertical)",
        isCorrect: true,
      },
      {
        id: 2,
        grid: [
          [0, 0],
          [6, 0],
        ],
        label: "Option B (Stay At Bottom / Gravity)",
        isCorrect: false,
      },
      {
        id: 3,
        grid: [
          [0, 6],
          [0, 0],
        ],
        label: "Option C (Rotate 90°)",
        isCorrect: false,
      },
      {
        id: 4,
        grid: [
          [0, 0],
          [0, 6],
        ],
        label: "Option D (Shift Right)",
        isCorrect: false,
      },
    ],
    explanation:
      "Adversarial Round! With only 1 demonstration, the AI suffered an epistemic failure: it presumed downward gravity was active instead of reflection. A human who spots reflection wins against the AI!",
  },
];

export function FinalChallenge() {
  const [currentRoundIdx, setCurrentRoundIdx] = useState<number>(0);
  const [userSelectedOptionId, setUserSelectedOptionId] = useState<number | null>(null);
  const [hasRevealed, setHasRevealed] = useState<boolean>(false);
  const [userScore, setUserScore] = useState<number>(0);
  const [aiScore, setAiScore] = useState<number>(0);

  const round = CHALLENGE_ROUNDS[currentRoundIdx];
  const userOption = round.options.find((o) => o.id === userSelectedOptionId);
  const userIsCorrect = userOption?.isCorrect ?? false;
  const aiIsCorrect =
    JSON.stringify(round.aiPredicted) === JSON.stringify(round.groundTruth);

  const handleSelectOption = (optionId: number) => {
    if (hasRevealed) return;
    setUserSelectedOptionId(optionId);
  };

  const handleRevealShowdown = () => {
    if (!userSelectedOptionId) return;
    setHasRevealed(true);

    if (userIsCorrect) {
      setUserScore((prev) => prev + 100);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }
    if (aiIsCorrect) {
      setAiScore((prev) => prev + 100);
    }
  };

  const handleNextRound = () => {
    const next = (currentRoundIdx + 1) % CHALLENGE_ROUNDS.length;
    setCurrentRoundIdx(next);
    setUserSelectedOptionId(null);
    setHasRevealed(false);
  };

  return (
    <section id="challenge" className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-mono mb-1">
            <Trophy className="h-4 w-4" />
            <span>Interactive Gamified Arena</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center space-x-2">
            <span>Final Challenge: User vs AI vs Ground Truth</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Test your inductive reasoning against the learning engine. You predict first, then reveal the AI and Ground Truth!
          </p>
        </div>

        {/* Live Scoreboard */}
        <div className="flex items-center space-x-3 bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 text-xs font-mono">
          <div className="flex items-center space-x-1.5 text-cyan-400 px-2 py-1 rounded bg-cyan-950/60 border border-cyan-500/20">
            <User className="h-3.5 w-3.5" />
            <span className="font-bold">You: {userScore} pts</span>
          </div>
          <span className="text-slate-600 font-bold">vs</span>
          <div className="flex items-center space-x-1.5 text-purple-400 px-2 py-1 rounded bg-purple-950/60 border border-purple-500/20">
            <Bot className="h-3.5 w-3.5" />
            <span className="font-bold">AI: {aiScore} pts</span>
          </div>
        </div>
      </div>

      {/* Main Challenge Arena */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-amber-500/40 shadow-xl space-y-6">
        {/* Round Meta */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/30 text-amber-300 font-bold">
              Round {currentRoundIdx + 1} of {CHALLENGE_ROUNDS.length}
            </span>
            <span className="text-sm font-bold text-white">{round.name}</span>
          </div>

          <span
            className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
              round.difficulty === "Easy"
                ? "bg-emerald-950/50 text-emerald-400 border-emerald-500/30"
                : round.difficulty === "Medium"
                ? "bg-amber-950/50 text-amber-400 border-amber-500/30"
                : "bg-rose-950/50 text-rose-400 border-rose-500/30"
            }`}
          >
            {round.difficulty}
          </span>
        </div>

        {/* Step 1: Given Demonstrations */}
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase text-slate-400 font-bold block">
            Given Demonstrations ({round.demonstrations.length}):
          </span>
          <div className="flex flex-wrap items-center gap-4">
            {round.demonstrations.map((d, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center space-x-3"
              >
                <GridEditor grid={d.input} size="sm" isReadOnly={true} title={`Demo ${i + 1} In`} />
                <ArrowRight className="h-4 w-4 text-slate-500" />
                <GridEditor grid={d.output} size="sm" isReadOnly={true} title={`Demo ${i + 1} Out`} />
              </div>
            ))}
          </div>
        </div>

        {/* Step 2: Unseen Problem & User Prediction */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <span className="h-6 w-6 rounded-md bg-amber-500/20 text-amber-300 font-mono font-bold text-xs flex items-center justify-center">
                !
              </span>
              <span className="text-xs font-mono font-bold text-white uppercase">
                Step 1: Unseen Test Input &mdash; Choose Your Output Prediction
              </span>
            </div>
            {!hasRevealed && (
              <span className="text-xs text-amber-400 font-mono animate-pulse">
                &larr; Select one option below to lock your answer
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
            <GridEditor grid={round.testInput} size="md" isReadOnly={true} title="Unseen Test Input" />
            <ArrowRight className="h-6 w-6 text-amber-400 shrink-0" />
            <div className="text-center text-xs font-mono text-slate-400">
              {userSelectedOptionId ? (
                <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-bold">
                  Option {userSelectedOptionId} Selected!
                </div>
              ) : (
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-500">
                  Select your prediction below
                </div>
              )}
            </div>
          </div>

          {/* User Option Grid Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {round.options.map((opt) => {
              const isSelected = userSelectedOptionId === opt.id;
              return (
                <button
                  key={opt.id}
                  disabled={hasRevealed}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`p-3 rounded-xl border flex flex-col items-center space-y-2 transition ${
                    isSelected
                      ? "bg-cyan-950/60 border-cyan-400 ring-2 ring-cyan-500/40"
                      : "bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-850"
                  }`}
                >
                  <GridEditor grid={opt.grid} size="sm" isReadOnly={true} />
                  <span
                    className={`text-[11px] font-mono font-semibold ${
                      isSelected ? "text-cyan-300 font-bold" : "text-slate-400"
                    }`}
                  >
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Reveal Button */}
          {!hasRevealed && (
            <div className="pt-3 text-center">
              <button
                disabled={!userSelectedOptionId}
                onClick={handleRevealShowdown}
                className={`px-6 py-2.5 rounded-xl font-bold text-xs uppercase font-mono tracking-wider transition ${
                  userSelectedOptionId
                    ? "bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-slate-950 shadow-lg shadow-amber-500/25"
                    : "bg-slate-800 text-slate-500 cursor-not-allowed"
                }`}
              >
                Reveal AI &amp; Ground Truth Showdown &rarr;
              </button>
            </div>
          )}
        </div>

        {/* Step 3: Showdown Results (User vs AI vs Ground Truth) */}
        {hasRevealed && (
          <div className="p-5 rounded-xl bg-slate-950 border border-indigo-500/40 space-y-5 animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs uppercase font-mono tracking-wider text-cyan-400 font-bold">
                Showdown Outcome: 3-Way Comparison
              </span>
              <button
                onClick={handleNextRound}
                className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center space-x-1"
              >
                <span>Next Round &rarr;</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center justify-items-center">
              {/* User Outcome */}
              <div
                className={`p-4 rounded-xl border w-full flex flex-col items-center space-y-2 text-center ${
                  userIsCorrect
                    ? "bg-emerald-950/40 border-emerald-500/40"
                    : "bg-rose-950/40 border-rose-500/40"
                }`}
              >
                <div className="flex items-center space-x-1.5 text-xs font-mono font-bold">
                  <User className="h-4 w-4" />
                  <span>You (User)</span>
                </div>
                {userOption && <GridEditor grid={userOption.grid} size="sm" isReadOnly={true} />}
                <div className="flex items-center space-x-1 text-xs font-bold font-mono">
                  {userIsCorrect ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span className="text-emerald-300">Correct (+100 pts)</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-rose-400" />
                      <span className="text-rose-300">Wrong Choice</span>
                    </>
                  )}
                </div>
              </div>

              {/* AI Outcome */}
              <div
                className={`p-4 rounded-xl border w-full flex flex-col items-center space-y-2 text-center ${
                  aiIsCorrect
                    ? "bg-emerald-950/40 border-emerald-500/40"
                    : "bg-rose-950/40 border-rose-500/40"
                }`}
              >
                <div className="flex items-center space-x-1.5 text-xs font-mono font-bold text-purple-300">
                  <Bot className="h-4 w-4" />
                  <span>AI Synthesizer</span>
                </div>
                <GridEditor grid={round.aiPredicted} size="sm" isReadOnly={true} />
                <div className="flex items-center space-x-1 text-xs font-bold font-mono">
                  {aiIsCorrect ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span className="text-emerald-300">AI Succeeded ({round.aiConfidence}%)</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-rose-400" />
                      <span className="text-rose-300">AI Failed ({round.aiConfidence}%)</span>
                    </>
                  )}
                </div>
              </div>

              {/* Ground Truth */}
              <div className="p-4 rounded-xl border border-slate-700 bg-slate-900 w-full flex flex-col items-center space-y-2 text-center">
                <div className="text-xs font-mono font-bold text-slate-300">
                  Ground Truth (Target)
                </div>
                <GridEditor grid={round.groundTruth} size="sm" isReadOnly={true} />
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  Verified Invariant Rule
                </span>
              </div>
            </div>

            {/* Rule Explanation */}
            <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-xs font-mono font-bold text-indigo-300 block">
                Rule Explanation:
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">{round.explanation}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
