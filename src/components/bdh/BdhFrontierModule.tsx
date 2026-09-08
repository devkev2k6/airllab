"use client";

import React from "react";
import { ARCHITECTURAL_COMPARISONS } from "@/lib/bdh/bdh-model";
import { LatentStateVisualizer } from "./LatentStateVisualizer";
import {
  Sparkles,
  Brain,
  Cpu,
  BookOpen,
  DollarSign,
  TrendingUp,
  FileText,
  ExternalLink,
} from "lucide-react";

interface BdhFrontierModuleProps {
  taskName: string;
  demoCount: number;
  onExploreCompleted?: () => void;
}

export function BdhFrontierModule({
  taskName,
  demoCount,
  onExploreCompleted,
}: BdhFrontierModuleProps) {
  return (
    <section id="bdh-cq" className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Module Title & Literature Demarcation Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-purple-400 text-xs font-mono mb-1">
            <Brain className="h-4 w-4" />
            <span>Frontier Architecture Contrast</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Frontier Contrast: BDH-CQ (Pathway Track)
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Understanding test-time adaptation in recurrent continuous latent memory versus discrete symbolic rule induction.
          </p>
        </div>

        {/* Pathway Benchmark Card */}
        <div className="flex items-center space-x-3 bg-gradient-to-r from-purple-950/60 to-slate-900 p-3 rounded-xl border border-purple-500/40 text-xs">
          <div className="p-2 rounded-lg bg-purple-500/20 text-purple-300">
            <DollarSign className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-purple-300 uppercase block">
              ARC-AGI-1 Benchmark
            </span>
            <span className="font-bold text-white text-sm">29.5% @ $0.0007 / task</span>
          </div>
        </div>
      </div>

      {/* Demarcation Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Our Toy Implementation */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 space-y-2">
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold uppercase">
            <Cpu className="h-4 w-4" />
            <span>Our Toy Implementation</span>
          </div>
          <h4 className="text-base font-bold text-white">Deterministic Symbolic Program Synthesis</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Constructs and prunes a discrete search space of 2D affine, color, morphological, and gravity operators. Operates in &lt;10ms with zero model parameters and complete human interpretability, but suffers from combinatorial scaling on non-affine rules.
          </p>
          <div className="flex items-center space-x-2 text-[11px] font-mono text-cyan-300/80 pt-1">
            <span className="px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/20">0 Parameters</span>
            <span className="px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/20">Discrete Grammar</span>
            <span className="px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/20">Client-Side</span>
          </div>
        </div>

        {/* Reported Primary Literature (BDH-CQ) */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-purple-500/40 space-y-2">
          <div className="flex items-center space-x-2 text-purple-400 font-mono text-xs font-bold uppercase">
            <Brain className="h-4 w-4" />
            <span>Reported Primary Literature (arXiv / Pathway)</span>
          </div>
          <h4 className="text-base font-bold text-white">150M Recurrent Latent Architecture (BDH-CQ)</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            A post-Transformer recurrent model that digests demonstrations into a persistent continuous latent state Sₖ without token generation, verbal chain-of-thought, or inference-time weight updates (∇W = 0). Memory overhead remains strictly O(1) per task.
          </p>
          <div className="flex items-center space-x-2 text-[11px] font-mono text-purple-300/80 pt-1">
            <span className="px-1.5 py-0.5 rounded bg-purple-950/80 border border-purple-500/30">150M Parameters</span>
            <span className="px-1.5 py-0.5 rounded bg-purple-950/80 border border-purple-500/30">O(1) Recurrent Latent</span>
            <span className="px-1.5 py-0.5 rounded bg-purple-950/80 border border-purple-500/30">∇W = 0 At Test Time</span>
          </div>
        </div>
      </div>

      {/* Interactive Latent State Visualizer */}
      <LatentStateVisualizer
        taskName={taskName}
        demoCount={demoCount}
        onExploreCompleted={onExploreCompleted}
      />

      {/* Comprehensive Architectural Comparison Table */}
      <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center space-x-2 text-white">
          <BookOpen className="h-4 w-4 text-cyan-400" />
          <h3 className="text-base font-bold">
            Architectural Comparison: Symbolic Synthesis vs. BDH-CQ vs. Standard LLM
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono">
                <th className="py-2.5 px-3">Dimension</th>
                <th className="py-2.5 px-3 text-cyan-300 bg-cyan-950/20">Our Toy Model</th>
                <th className="py-2.5 px-3 text-purple-300 bg-purple-950/20">BDH-CQ (Pathway)</th>
                <th className="py-2.5 px-3 text-slate-300">Standard LLM (e.g. GPT-4o)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {ARCHITECTURAL_COMPARISONS.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-semibold font-mono text-slate-400">{row.dimension}</td>
                  <td className="py-3 px-3 bg-cyan-950/10 text-cyan-200">{row.toyModel}</td>
                  <td className="py-3 px-3 bg-purple-950/10 text-purple-200 font-medium">{row.bdhCq}</td>
                  <td className="py-3 px-3 text-slate-400">{row.standardLlm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
