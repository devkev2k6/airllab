"use client";

import React, { useState } from "react";
import { RuleHypothesis, PredictionResult } from "@/lib/arc/types";
import {
  Cpu,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Activity,
  Layers,
  Sparkles,
} from "lucide-react";

interface HypothesisViewerProps {
  predictionResult: PredictionResult;
  demoCount: number;
}

export function HypothesisViewer({
  predictionResult,
  demoCount,
}: HypothesisViewerProps) {
  const [expandedTraceIdx, setExpandedTraceIdx] = useState<number | null>(0);

  const hypotheses = predictionResult.topHypotheses;

  return (
    <div id="engine" className="space-y-4">
      {/* Prominent Label as Required */}
      <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/40 text-amber-200 flex items-center space-x-3 text-xs">
        <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />
        <div>
          <span className="font-bold uppercase tracking-wider block font-mono">
            Independent Educational Toy Model (Symbolic Synthesis) — NOT official BDH or BDH-CQ
          </span>
          <span className="text-[11px] text-amber-300/80">
            This deterministic rule induction engine searches a discrete grammar of 2D affine, morphological, gravity, and color transformations in &lt;10ms client-side.
          </span>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <Cpu className="h-5 w-5 text-indigo-400" />
            <span>Top-3 Candidate Rule Hypotheses</span>
          </h3>
          <p className="text-xs text-slate-400">
            Ranked by consistency across active demonstrations and Occam&rsquo;s razor (simplicity prior).
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono text-slate-400">Search Space:</span>
          <span className="ml-2 text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
            Affine • Color • Gravity • Frame
          </span>
        </div>
      </div>

      {/* Hypotheses Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {hypotheses.map((hyp, index) => {
          const isTop = index === 0;
          const isExpanded = expandedTraceIdx === index;

          const familyBadgeColors = {
            affine: "bg-blue-950/60 text-blue-300 border-blue-500/40",
            color: "bg-pink-950/60 text-pink-300 border-pink-500/40",
            composite: "bg-purple-950/60 text-purple-300 border-purple-500/40",
            morphology: "bg-emerald-950/60 text-emerald-300 border-emerald-500/40",
            gravity: "bg-amber-950/60 text-amber-300 border-amber-500/40",
          }[hyp.family];

          return (
            <div
              key={hyp.id}
              className={`rounded-xl border p-4 flex flex-col justify-between transition-all duration-200 ${
                isTop
                  ? "bg-gradient-to-b from-indigo-950/40 to-slate-900 border-indigo-500/60 ring-1 ring-indigo-500/30 shadow-lg shadow-indigo-950/40"
                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div>
                {/* Rank & Confidence Pill */}
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-xs font-bold font-mono px-2 py-0.5 rounded-full ${
                      isTop
                        ? "bg-indigo-500 text-white shadow-sm"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    #{index + 1} Hypothesis {isTop && "★ Top Pick"}
                  </span>

                  <div className="flex items-center space-x-1">
                    <span className="text-xs font-mono text-slate-400">Confidence:</span>
                    <span
                      className={`text-sm font-bold font-mono ${
                        hyp.confidence >= 80
                          ? "text-emerald-400"
                          : hyp.confidence >= 50
                          ? "text-amber-400"
                          : "text-rose-400"
                      }`}
                    >
                      {hyp.confidence}%
                    </span>
                  </div>
                </div>

                {/* Name & Family */}
                <div className="mb-2">
                  <div className="flex items-center space-x-1.5 mb-1">
                    <span
                      className={`text-[10px] uppercase font-mono px-1.5 py-0.2 rounded border ${familyBadgeColors}`}
                    >
                      {hyp.family}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      Complexity: {hyp.complexityScore}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-white tracking-tight">{hyp.name}</h4>
                  <p className="text-xs text-slate-300 mt-1">{hyp.description}</p>
                </div>

                {/* Demonstration Matches */}
                <div className="py-2 border-t border-slate-800/80 my-2">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1.5">
                    Demonstration Consistency ({hyp.matchesDemos.slice(0, demoCount).filter(Boolean).length}/{demoCount}):
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {hyp.matchesDemos.slice(0, demoCount).map((matches, dIdx) => (
                      <span
                        key={dIdx}
                        className={`text-[11px] font-mono px-2 py-0.5 rounded flex items-center space-x-1 border ${
                          matches
                            ? "bg-emerald-950/40 text-emerald-300 border-emerald-500/30"
                            : "bg-rose-950/40 text-rose-300 border-rose-500/30"
                        }`}
                      >
                        {matches ? (
                          <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                        ) : (
                          <XCircle className="h-3 w-3 text-rose-400" />
                        )}
                        <span>Demo {dIdx + 1}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Reasoning Trace Collapsible */}
              <div className="mt-2 pt-2 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setExpandedTraceIdx(isExpanded ? null : index)}
                  className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-cyan-300 transition"
                >
                  <span className="font-mono text-[11px]">Reasoning Trace &amp; Audit</span>
                  {isExpanded ? (
                    <ChevronUp className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5" />
                  )}
                </button>

                {isExpanded && (
                  <div className="mt-2 p-2.5 rounded bg-slate-950/90 border border-slate-800 text-[11px] font-mono space-y-1 text-slate-300 animate-in fade-in duration-150">
                    {hyp.reasoningTrace.map((line, lIdx) => (
                      <div
                        key={lIdx}
                        className={line.startsWith("✓") ? "text-emerald-400" : "text-rose-400"}
                      >
                        {line}
                      </div>
                    ))}
                    <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-900">
                      Calculated overall cell accuracy: {hyp.overallAccuracy}%
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
