"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Brain,
  Layers,
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Database,
  Search,
  Code2,
  HelpCircle,
  Flame,
} from "lucide-react";

export function LearnTheConcept() {
  const [activeTab, setActiveTab] = useState<"overview" | "memorization-vs-learning" | "terms">(
    "overview"
  );
  const [testNumber, setTestNumber] = useState<number>(7);
  const [testRan, setTestRan] = useState<boolean>(false);

  // Example demonstrated pairs: 1 -> 2, 2 -> 4, 3 -> 6 (Rule: multiply by 2)
  const memorizedPairs = [
    { in: 1, out: 2 },
    { in: 2, out: 4 },
    { in: 3, out: 6 },
  ];

  const memorizerHasKey = memorizedPairs.some((p) => p.in === testNumber);
  const memorizerResult = memorizerHasKey ? testNumber * 2 : null;
  const learnerResult = testNumber * 2; // Induced rule: f(x) = 2x
  const groundTruth = testNumber * 2;

  const handleRunTest = (n: number) => {
    setTestNumber(n);
    setTestRan(true);
  };

  return (
    <section id="concept" className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono mb-1">
            <BookOpen className="h-4 w-4" />
            <span>Core Theoretical Grounding</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Learn the Concept: From Examples to Understanding
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            How can an AI acquire a generalized skill solely from observing a few input-output demonstrations?
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center space-x-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === "overview"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Concept Overview
          </button>
          <button
            onClick={() => setActiveTab("memorization-vs-learning")}
            className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 ${
              activeTab === "memorization-vs-learning"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Flame className="h-3.5 w-3.5 text-amber-400" />
            <span>Memorization vs Learning</span>
          </button>
          <button
            onClick={() => setActiveTab("terms")}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === "terms"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Key Terms (Plain English)
          </button>
        </div>
      </div>

      {/* Tab 1: Concept Overview */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Step 1: Few Demonstrations */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition space-y-3">
              <div className="flex items-center justify-between">
                <span className="h-7 w-7 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center text-xs font-mono font-bold">
                  01
                </span>
                <span className="text-[11px] font-mono text-slate-500 uppercase">Input Signal</span>
              </div>
              <h3 className="text-base font-bold text-white">Demonstrations (Input &rarr; Output)</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Rather than receiving explicit instructions, the model is given a handful (1 to 4) of paired examples illustrating how inputs transform into outputs.
              </p>
              <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 font-mono text-xs text-cyan-300">
                1 &rarr; 2 &nbsp;|&nbsp; 2 &rarr; 4 &nbsp;|&nbsp; 3 &rarr; 6
              </div>
            </div>

            {/* Step 2: Rule Induction */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition space-y-3">
              <div className="flex items-center justify-between">
                <span className="h-7 w-7 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center text-xs font-mono font-bold">
                  02
                </span>
                <span className="text-[11px] font-mono text-slate-500 uppercase">Search / Recurrence</span>
              </div>
              <h3 className="text-base font-bold text-white">Rule Induction (Compression)</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                The agent searches for the most compact invariant law that explains all demonstrated transitions without contradiction (Occam&apos;s Razor).
              </p>
              <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 font-mono text-xs text-indigo-300">
                Hypothesis: f(x) = 2 &times; x &nbsp;(Complexity: 1.0)
              </div>
            </div>

            {/* Step 3: Out-of-Distribution Generalization */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition space-y-3">
              <div className="flex items-center justify-between">
                <span className="h-7 w-7 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center text-xs font-mono font-bold">
                  03
                </span>
                <span className="text-[11px] font-mono text-slate-500 uppercase">Evaluation</span>
              </div>
              <h3 className="text-base font-bold text-white">Generalization to Unseen Input</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                The induced rule is applied to a novel test input that the AI has never encountered before. If the output matches ground truth, the AI has genuinely learned.
              </p>
              <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 font-mono text-xs text-emerald-300 flex items-center justify-between">
                <span>7 &rarr; 14</span>
                <span className="text-emerald-400 font-bold">✓ Match</span>
              </div>
            </div>
          </div>

          {/* Simple Explanation Callout */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-indigo-500/30 text-xs sm:text-sm text-slate-300 space-y-2">
            <h4 className="text-white font-semibold text-sm flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span>Why ARC-AGI Benchmarking Matters</span>
            </h4>
            <p className="leading-relaxed">
              In François Chollet&apos;s benchmark <strong>ARC-AGI</strong>, tasks are intentionally designed so that no standard internet pre-training allows rote memorization. Each task is a brand-new miniature microworld. True intelligence is not knowing answers in advance; it is the <strong>speed and efficiency of acquiring new skills from limited demonstrations</strong>.
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Memorization vs Learning Interactive Section */}
      {activeTab === "memorization-vs-learning" && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-indigo-500/40 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs uppercase font-mono tracking-wider text-amber-400 font-bold block">
                  Interactive Experiment
                </span>
                <h3 className="text-lg font-bold text-white">
                  Memorization vs. Learning: The Unseen Input Test
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                Training Set: (1&rarr;2), (2&rarr;4), (3&rarr;6)
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              <strong>Memorization</strong> records specific data points in a table. It works flawlessly on seen data, but fails catastrophically when a new problem arrives. <strong>Learning</strong> extracts the underlying relationship <em>f(x) = 2x</em>, allowing it to generalize correctly to infinite unseen numbers.
            </p>

            {/* Interactive Test Controller */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono text-slate-300 font-bold">Pick Test Input:</span>
                  <div className="flex items-center space-x-1.5">
                    {[2, 3, 5, 7, 12, 99].map((n) => (
                      <button
                        key={n}
                        onClick={() => handleRunTest(n)}
                        className={`px-2.5 py-1 rounded-md text-xs font-mono font-semibold transition ${
                          testNumber === n
                            ? "bg-cyan-500 text-slate-950 font-bold shadow"
                            : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                        }`}
                      >
                        {n}
                        {[1, 2, 3].includes(n) ? " (Seen)" : " (Unseen)"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-xs font-mono text-slate-400">
                  Ground Truth: <span className="text-emerald-400 font-bold">{groundTruth}</span>
                </div>
              </div>
            </div>

            {/* Side-by-Side Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Memorization Box */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-rose-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-rose-400 font-mono text-xs font-bold uppercase">
                    <Database className="h-4 w-4" />
                    <span>Memorization (Lookup Table)</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/60 border border-rose-500/30 text-rose-300">
                    O(N) Storage • Zero Transfer
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5 font-mono text-xs">
                  <div className="text-slate-400 text-[11px] pb-1 border-b border-slate-800">
                    Cached Lookup Table:
                  </div>
                  <div className="text-slate-300 flex justify-between">
                    <span>Key 1 &rarr; 2</span>
                    <span>Key 2 &rarr; 4</span>
                    <span>Key 3 &rarr; 6</span>
                  </div>
                </div>

                <div className="pt-1">
                  <div className="text-xs font-mono text-slate-400 mb-1">
                    Lookup Result for <span className="text-white font-bold">{testNumber}</span>:
                  </div>
                  {memorizerHasKey ? (
                    <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between text-xs font-mono text-emerald-300">
                      <span>Found in memory! Result: {memorizerResult}</span>
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/40 flex items-center justify-between text-xs font-mono text-rose-300">
                      <span>Error: Key {testNumber} not in training set!</span>
                      <XCircle className="h-4 w-4 text-rose-400" />
                    </div>
                  )}
                </div>

                <p className="text-[11px] text-slate-400">
                  {memorizerHasKey
                    ? "Succeeds only because the input was directly memorized during demonstration."
                    : "Failure: A lookup table cannot answer questions outside its pre-recorded cache."}
                </p>
              </div>

              {/* Learning Box */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs font-bold uppercase">
                    <Code2 className="h-4 w-4" />
                    <span>Learning (Program Induction)</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
                    O(1) Program • Infinite Generalization
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5 font-mono text-xs">
                  <div className="text-slate-400 text-[11px] pb-1 border-b border-slate-800">
                    Induced Generative Rule:
                  </div>
                  <div className="text-emerald-400 font-bold">
                    f(x) = 2 &times; x &nbsp;&nbsp;(Complexity: Minimal)
                  </div>
                </div>

                <div className="pt-1">
                  <div className="text-xs font-mono text-slate-400 mb-1">
                    Function Output for <span className="text-white font-bold">{testNumber}</span>:
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between text-xs font-mono text-emerald-300">
                    <span>Evaluated f({testNumber}) = {learnerResult}</span>
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  </div>
                </div>

                <p className="text-[11px] text-slate-400">
                  Success! The model learned the invariant relation, so it derives the exact answer regardless of whether {testNumber} was ever seen before.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Key Terms in Simple English */}
      {activeTab === "terms" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <h4 className="text-sm font-bold text-cyan-300 flex items-center space-x-1.5">
              <span>1. Demonstration</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              An input-output example pair that shows what happens without explicitly stating why or how.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <h4 className="text-sm font-bold text-indigo-300 flex items-center space-x-1.5">
              <span>2. Rule Induction</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              The reverse-engineering process where the AI deduces the underlying function that produces all the outputs.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <h4 className="text-sm font-bold text-emerald-300 flex items-center space-x-1.5">
              <span>3. Generalization</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              The acid test of intelligence: applying the learned rule to unseen data accurately, rather than repeating stored answers.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <h4 className="text-sm font-bold text-purple-300 flex items-center space-x-1.5">
              <span>4. Ground Truth</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              The verified correct target output for an unseen input, against which the AI&apos;s prediction is judged correct or wrong.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
