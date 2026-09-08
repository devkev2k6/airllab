"use client";

import React, { useState, useEffect } from "react";
import {
  Compass,
  X,
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  Sparkles,
  Layers,
  Cpu,
  Brain,
  ShieldAlert,
} from "lucide-react";

interface GuidedTourProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateSection: (sectionId: string) => void;
}

const TOUR_STEPS = [
  {
    step: 1,
    targetSection: "sandbox",
    title: "1. ARC-AGI Grid & Color Representation",
    icon: <Layers className="h-5 w-5 text-cyan-400" />,
    description:
      "ARC-AGI puzzles represent visual concepts using a standard 10-color alphabet (0: Black to 9: Maroon) on 2D discrete grids. You can click cells in any demonstration or test grid to paint colors or customize patterns.",
    highlight: "Demonstration Sandbox",
  },
  {
    step: 2,
    targetSection: "sandbox",
    title: "2. Demonstration Density & Entropy Contraction",
    icon: <Sparkles className="h-5 w-5 text-indigo-400" />,
    description:
      "With 1 demonstration, dozens of candidate rules remain ambiguous (e.g. 90° rotation vs reflection vs color remapping). Slide the Demonstration Density slider from 1 to 4 to witness candidate rule entropy collapse to a unique deterministic invariant.",
    highlight: "Density Slider (1 → 4)",
  },
  {
    step: 3,
    targetSection: "engine",
    title: "3. Symbolic Rule Induction Engine (Toy Model)",
    icon: <Cpu className="h-5 w-5 text-emerald-400" />,
    description:
      "Our toy model performs pure symbolic synthesis client-side (<10ms). It scores candidate transformations against demonstrations using Occam's razor (simplicity prior) and outputs cell-by-cell confidence heatmaps and side-by-side truth-vs-prediction diffs.",
    highlight: "Top-3 Hypotheses & Diff Matrix",
  },
  {
    step: 4,
    targetSection: "bdh-cq",
    title: "4. Frontier Contrast: BDH-CQ (Pathway Track)",
    icon: <Brain className="h-5 w-5 text-purple-400" />,
    description:
      "Unlike symbolic grammar filters, BDH-CQ is a 150M parameter post-Transformer model achieving 29.5% on ARC-AGI-1 at $0.0007/task. It performs test-time adaptation purely in recurrent latent memory S_k = U(S_{k-1}, D_k) with zero weight updates (∇W = 0) and zero verbal chain-of-thought.",
    highlight: "Recurrent Latent State Accumulator",
  },
  {
    step: 5,
    targetSection: "assessment",
    title: "5. Adversarial Sandbox & 'Explain-Back'",
    icon: <ShieldAlert className="h-5 w-5 text-red-400" />,
    description:
      "Test your understanding! Open 'Break the Rule' to construct counterexamples that challenge the top hypothesis, or type your plain-English rule description into the 'Explain-Back' box to earn achievements and master ARC reasoning.",
    highlight: "Assessment & Achievement Badges",
  },
];

export function GuidedTour({
  isOpen,
  onClose,
  onNavigateSection,
}: GuidedTourProps) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const step = TOUR_STEPS[currentStepIdx];

  // Auto-play timer (12 seconds per slide)
  useEffect(() => {
    if (!isOpen || !isAutoPlaying) return;
    const timer = setInterval(() => {
      setCurrentStepIdx((prev) => {
        if (prev >= TOUR_STEPS.length - 1) {
          setIsAutoPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 12000);
    return () => clearInterval(timer);
  }, [isOpen, isAutoPlaying]);

  useEffect(() => {
    if (isOpen && step) {
      onNavigateSection(step.targetSection);
    }
  }, [isOpen, currentStepIdx]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStepIdx < TOUR_STEPS.length - 1) {
      setCurrentStepIdx((p) => p + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx((p) => p - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-cyan-500/40 rounded-2xl p-6 shadow-2xl shadow-cyan-950/60 space-y-4">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Compass className="h-5 w-5 text-cyan-400" />
            <span className="font-bold text-sm text-white font-mono uppercase tracking-wider">
              60-Second Guided Tour
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center space-x-1"
              title={isAutoPlaying ? "Pause Auto-play" : "Play Auto-walkthrough"}
            >
              {isAutoPlaying ? (
                <>
                  <Pause className="h-3.5 w-3.5 text-amber-400" />
                  <span className="text-[10px] font-mono">Pause</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-[10px] font-mono">Auto</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Step Indicator Dots */}
        <div className="flex items-center space-x-1.5">
          {TOUR_STEPS.map((s, idx) => (
            <button
              key={s.step}
              onClick={() => setCurrentStepIdx(idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentStepIdx
                  ? "w-8 bg-cyan-400"
                  : idx < currentStepIdx
                  ? "w-4 bg-indigo-500"
                  : "w-3 bg-slate-800"
              }`}
            />
          ))}
        </div>

        {/* Content Body */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-slate-800 border border-slate-700">
              {step.icon}
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block">
                Step {step.step} of {TOUR_STEPS.length} • Highlighting: {step.highlight}
              </span>
              <h3 className="text-base font-bold text-white">{step.title}</h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {step.description}
          </p>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <button
            onClick={handlePrev}
            disabled={currentStepIdx === 0}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none transition flex items-center space-x-1"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>Previous</span>
          </button>

          <span className="text-[11px] font-mono text-slate-500">
            {currentStepIdx + 1} / {TOUR_STEPS.length}
          </span>

          <button
            onClick={handleNext}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-500 to-indigo-600 text-white hover:from-cyan-400 hover:to-indigo-500 transition flex items-center space-x-1"
          >
            <span>{currentStepIdx === TOUR_STEPS.length - 1 ? "Finish Tour" : "Next Step"}</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
