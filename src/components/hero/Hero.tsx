"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Compass, ArrowRight, Zap, Brain, ShieldAlert, Cpu, BarChart3 } from "lucide-react";

interface HeroProps {
  onStartTour: () => void;
  onStartExperimenting: () => void;
}

export function Hero({ onStartTour, onStartExperimenting }: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-8 pb-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 bg-gradient-to-b from-slate-950 via-slate-900/60 to-slate-950">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-gradient-to-b from-cyan-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto text-center space-y-6">
        {/* Top Badges */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
          <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
          <span>Interactive Cognitive Architecture Lab • ARC-AGI Benchmark</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
          AI Rule Learning{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            Lab
          </span>
        </h1>

        {/* Tagline */}
        <p className="text-lg sm:text-xl font-medium text-slate-300 max-w-3xl mx-auto">
          See • Learn • Experiment • Understand:{" "}
          <span className="text-cyan-400 font-semibold">Not just answers</span>, but the{" "}
          <span className="text-indigo-400 font-semibold">thinking behind them</span>.
        </p>

        {/* One-Sentence Claim Box */}
        <div className="max-w-4xl mx-auto p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 shadow-lg shadow-cyan-950/40 text-left relative overflow-hidden">
          <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 via-indigo-500 to-purple-500" />
          <div className="flex items-start space-x-3 pl-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 mt-0.5 shrink-0">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <span className="text-xs uppercase font-mono tracking-wider text-cyan-400 font-bold block mb-1">
                Core Empirical Claim
              </span>
              <p className="text-sm sm:text-base text-slate-200 font-serif leading-relaxed">
                &ldquo;This artifact demonstrates that symbolic rule-induction identifies deterministic 2D affine and color transformations within ≤3 demonstrations, whereas BDH-CQ accumulates non-verbal associations via a 150M recurrent latent state without inference-time weight updates.&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onStartTour}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl font-medium text-sm bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 hover:border-cyan-500/40 transition shadow-sm"
          >
            <Compass className="h-4 w-4 text-cyan-400" />
            <span>60-Second Guided Tour</span>
          </button>

          <button
            onClick={onStartExperimenting}
            className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25 transition transform active:scale-95"
          >
            <span>Start Experimenting</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Quick Telemetry Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 text-left max-w-4xl mx-auto">
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono mb-1">
              <Cpu className="h-3.5 w-3.5" />
              <span>Toy Synthesis</span>
            </div>
            <div className="text-base font-bold text-white">&lt; 10ms</div>
            <div className="text-[11px] text-slate-400">Pure client-side symbolic search</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-mono mb-1">
              <Brain className="h-3.5 w-3.5" />
              <span>BDH-CQ Architecture</span>
            </div>
            <div className="text-base font-bold text-white">150M Params</div>
            <div className="text-[11px] text-slate-400">Recurrent latent accumulation</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
            <div className="flex items-center space-x-2 text-purple-400 text-xs font-mono mb-1">
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>Test-Time Adaptation</span>
            </div>
            <div className="text-base font-bold text-white">∇W = 0</div>
            <div className="text-[11px] text-slate-400">Zero weight updates at inference</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-mono mb-1">
              <BarChart3 className="h-3.5 w-3.5" />
              <span>ARC-AGI-1 Pathway</span>
            </div>
            <div className="text-base font-bold text-white">29.5% @ $0.0007</div>
            <div className="text-[11px] text-slate-400">Primary literature reported rate</div>
          </div>
        </div>
      </div>
    </section>
  );
}
