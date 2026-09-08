"use client";

import React, { useState } from "react";
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Sparkles,
  RotateCcw,
  BookOpen,
  Award,
  ArrowRight,
  Brain,
} from "lucide-react";
import confetti from "canvas-confetti";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "What is the primary difference between memorization and learning?",
    options: [
      "Memorization is faster to compute than learning.",
      "Memorization stores seen training pairs, while learning induces an invariant rule that generalizes to unseen inputs.",
      "Learning requires a continuous GPU cluster, whereas memorization runs in the browser.",
      "There is no difference; they are synonymous in cognitive architectures.",
    ],
    correctIndex: 1,
    explanation:
      "Correct! Memorization is a lookup table that fails when presented with an unseen input. Learning induces the underlying function f(x) -> y, which accurately resolves unseen inputs.",
  },
  {
    id: 2,
    question: "Why did the model fail when only 1 demonstration was provided for a horizontally symmetric shape?",
    options: [
      "The browser ran out of client-side memory.",
      "The input contained too many colors.",
      "Multiple distinct transformations (e.g. 180° rotation and vertical flip) produced identical outputs on symmetric data.",
      "ARC-AGI tasks require at least 100 demonstrations to compile.",
    ],
    correctIndex: 2,
    explanation:
      "Spot on! Symmetries create epistemic ambiguity where 2 or more distinct rules produce identical results on the demonstration, leading to errors on asymmetric test inputs.",
  },
  {
    id: 3,
    question: "How does the BDH-CQ recurrent architecture adapt to new demonstrations at test time?",
    options: [
      "By fine-tuning its 150M weights via backpropagation (∇W ≠ 0).",
      "By growing an unbounded token KV-cache like GPT-4.",
      "By updating a 150M recurrent continuous latent memory state S_k with zero weight updates (∇W = 0).",
      "By consulting an external Python code interpreter.",
    ],
    correctIndex: 2,
    explanation:
      "Exactly! BDH-CQ operates without test-time backpropagation (∇W = 0) and maintains O(1) memory by sequentially accumulating associative demonstrations into a continuous latent vector.",
  },
  {
    id: 4,
    question: "According to François Chollet's measure of intelligence, what defines true cognitive capability?",
    options: [
      "The sheer volume of internet tokens stored during pre-training.",
      "The conversion rate of demonstration evidence into new skill acquisition efficiency over unseen microworlds.",
      "The number of parameters in the dense neural network.",
      "Generating fluent human-sounding prose.",
    ],
    correctIndex: 1,
    explanation:
      "Well done! Intelligence is not a measure of pre-existing knowledge or skill; it is the efficiency with which a learner converts past experience into novel capabilities across unfamiliar priors.",
  },
];

export function WhatDidYouLearn() {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSelect = (qId: number, optIdx: number) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const handleGradeQuiz = () => {
    setSubmitted(true);
    const score = QUIZ_QUESTIONS.filter(
      (q) => selectedAnswers[q.id] === q.correctIndex
    ).length;

    if (score >= 3) {
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setSubmitted(false);
  };

  const totalAnswered = Object.keys(selectedAnswers).length;
  const correctCount = QUIZ_QUESTIONS.filter(
    (q) => selectedAnswers[q.id] === q.correctIndex
  ).length;

  return (
    <section id="summary-quiz" className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-mono mb-1">
            <BookOpen className="h-4 w-4" />
            <span>Interactive Synthesis &amp; Self-Check</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            What Did You Learn? Interactive Summary &amp; Mini Quiz
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Consolidate your mental model of in-context rule induction, failure modalities, and recurrent architectures.
          </p>
        </div>

        {submitted && (
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 font-bold">
              Score: {correctCount} / {QUIZ_QUESTIONS.length} (
              {Math.round((correctCount / QUIZ_QUESTIONS.length) * 100)}%)
            </span>
            <button
              onClick={handleResetQuiz}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Retake Quiz"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* 4 Core Pillars Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/30 space-y-1.5">
          <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block">
            Pillar 01
          </span>
          <h4 className="text-sm font-bold text-white">Generalization over Memorization</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            True AI capability is evaluated by test performance on novel unseen microworlds, not recalling pre-baked datasets.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-indigo-500/30 space-y-1.5">
          <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold block">
            Pillar 02
          </span>
          <h4 className="text-sm font-bold text-white">Entropy Collapse via Data</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Each demonstration pair acts as a constraint, eliminating plausible hypotheses until rule entropy approaches &lt;0.4 bits.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-purple-500/30 space-y-1.5">
          <span className="text-[10px] font-mono uppercase text-purple-400 font-bold block">
            Pillar 03
          </span>
          <h4 className="text-sm font-bold text-white">Symbolic vs Recurrent Tradeoff</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Symbolic program synthesis offers 100% interpretability in &lt;10ms; BDH-CQ provides continuous O(1) memory tolerance for noise.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/30 space-y-1.5">
          <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">
            Pillar 04
          </span>
          <h4 className="text-sm font-bold text-white">Transparent Failure Modes</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Few demos, symmetries, contradictions, and depth horizons define why models stumble. Knowing failure enables targeted fixes.
          </p>
        </div>
      </div>

      {/* Mini Quiz Interactive Container */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2 text-white font-bold text-base">
            <Award className="h-5 w-5 text-indigo-400" />
            <span>Interactive Mini Quiz (4 Questions)</span>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {totalAnswered} of {QUIZ_QUESTIONS.length} Answered
          </span>
        </div>

        <div className="space-y-6">
          {QUIZ_QUESTIONS.map((q, idx) => {
            const userChoice = selectedAnswers[q.id];
            const isAnswered = userChoice !== undefined;
            const isCorrect = userChoice === q.correctIndex;

            return (
              <div
                key={q.id}
                className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3"
              >
                <div className="flex items-start space-x-2.5">
                  <span className="h-6 w-6 rounded-md bg-indigo-500/20 text-indigo-300 text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                    0{idx + 1}
                  </span>
                  <h4 className="text-sm font-semibold text-white leading-snug">
                    {q.question}
                  </h4>
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-8">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = userChoice === optIdx;
                    let optionStyle =
                      "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850";

                    if (submitted) {
                      if (optIdx === q.correctIndex) {
                        optionStyle =
                          "bg-emerald-950/60 border-emerald-500 text-emerald-200 font-semibold";
                      } else if (isSelected) {
                        optionStyle = "bg-rose-950/60 border-rose-500 text-rose-200";
                      }
                    } else if (isSelected) {
                      optionStyle = "bg-indigo-950/70 border-indigo-400 text-white font-medium";
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={submitted}
                        onClick={() => handleSelect(q.id, optIdx)}
                        className={`p-3 rounded-lg border text-left text-xs transition flex items-start space-x-2 ${optionStyle}`}
                      >
                        <span className="font-mono text-slate-500 font-bold shrink-0">
                          {String.fromCharCode(65 + optIdx)}.
                        </span>
                        <span className="flex-1">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation on submit */}
                {submitted && (
                  <div
                    className={`mt-2 p-3 rounded-lg border text-xs leading-relaxed pl-8 ${
                      isCorrect
                        ? "bg-emerald-950/30 border-emerald-500/30 text-emerald-300"
                        : "bg-rose-950/30 border-rose-500/30 text-rose-300"
                    }`}
                  >
                    <div className="flex items-center space-x-1.5 font-bold mb-1">
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                          <span>Correct</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-rose-400" />
                          <span>Incorrect</span>
                        </>
                      )}
                    </div>
                    <p>{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit Button */}
        {!submitted ? (
          <div className="text-center pt-2">
            <button
              disabled={totalAnswered < QUIZ_QUESTIONS.length}
              onClick={handleGradeQuiz}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs uppercase font-mono tracking-wider transition ${
                totalAnswered === QUIZ_QUESTIONS.length
                  ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed"
              }`}
            >
              Submit &amp; Grade Quiz ({totalAnswered}/{QUIZ_QUESTIONS.length}) &rarr;
            </button>
          </div>
        ) : (
          <div className="text-center pt-2">
            <button
              onClick={handleResetQuiz}
              className="px-5 py-2 rounded-xl text-xs font-mono font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            >
              Retake Quiz
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
