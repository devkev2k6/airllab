"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Code2,
  Sparkles,
  DollarSign,
  Play,
  Pause,
  RotateCcw,
  ShieldCheck,
  Cpu,
  GraduationCap,
  Building2,
  Layers,
  ChevronRight,
} from "lucide-react";

interface PitchStep {
  timeRange: string;
  title: string;
  action: string;
  scriptCue: string;
  sectionTarget: string;
}

const PITCH_STEPS: PitchStep[] = [
  {
    timeRange: "0 – 20s",
    title: "Catchy Reality Hook",
    action: "Frame the fundamental question of intelligence.",
    scriptCue:
      "“Can an AI truly master a generalizable rule from just a handful of demonstrations, or does it merely regurgitate training memories?”",
    sectionTarget: "concept",
  },
  {
    timeRange: "20 – 60s",
    title: "Live Demonstration",
    action: "Showcase the interactive demo lab running live inference in <1ms.",
    scriptCue:
      "“Notice how 3 demonstrations feed into our symbolic engine, discovering the invariant affine rotation in 0.9ms with zero external API calls.”",
    sectionTarget: "sandbox",
  },
  {
    timeRange: "60 – 90s",
    title: "Change Examples (Dynamic Response)",
    action: "Perturb or edit a cell and watch the hypothesis recalculate.",
    scriptCue:
      "“Watch what happens when we tweak a cell: the Occam simplicity prior dynamically re-ranks candidate rules in real time.”",
    sectionTarget: "sandbox",
  },
  {
    timeRange: "90 – 120s",
    title: "Failure Case Post-Mortem",
    action: "Expose an epistemic symmetry or few-demo trap.",
    scriptCue:
      "“Real science confronts failure: with only 1 symmetric demo, rotation and reflection tie. Here is why the AI fails, and the exact fix.”",
    sectionTarget: "failure-lab",
  },
  {
    timeRange: "120 – 150s",
    title: "Live Telemetry & Scaling Graph",
    action: "Highlight candidate rule entropy collapse and cost benchmarks.",
    scriptCue:
      "“As demonstration density increases from 1 to 3, entropy plummets from 3.4 to 0.4 bits, delivering $0.0007 cost-efficiency.”",
    sectionTarget: "telemetry",
  },
  {
    timeRange: "150 – 180s",
    title: "BDH-CQ Contrast & Future Vision",
    action: "Differentiate symbolic synthesis from continuous recurrent latent memory.",
    scriptCue:
      "“While our toy engine uses discrete grammars, frontier BDH-CQ maintains O(1) continuous latent states without weight tuning. Here is our monetization and classroom roadmap.”",
    sectionTarget: "bdh-cq",
  },
];

export function AboutProject() {
  const [activeTab, setActiveTab] = useState<"about" | "pitch" | "monetization">("about");
  const [pitchSeconds, setPitchSeconds] = useState<number>(0);
  const [isPitchRunning, setIsPitchRunning] = useState<boolean>(false);

  // Pitch timer interval
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPitchRunning) {
      timer = setInterval(() => {
        setPitchSeconds((prev) => {
          if (prev >= 180) {
            setIsPitchRunning(false);
            return 180;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPitchRunning]);

  const handleResetPitch = () => {
    setIsPitchRunning(false);
    setPitchSeconds(0);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const currentPitchStepIndex = Math.min(
    5,
    Math.floor(pitchSeconds / 30)
  );

  return (
    <section id="about" className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-mono mb-1">
            <Users className="h-4 w-4" />
            <span>Transparency, Governance &amp; Roadmap</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            About the Project &amp; Future Vision
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Team methodology, AI-assistance disclosures, commercialization plan, and the 3-minute hackathon demo guide.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center space-x-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab("about")}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === "about"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            About &amp; Disclosures
          </button>
          <button
            onClick={() => setActiveTab("monetization")}
            className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 ${
              activeTab === "monetization"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
            <span>Monetization Plan</span>
          </button>
          <button
            onClick={() => setActiveTab("pitch")}
            className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 ${
              activeTab === "pitch"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Play className="h-3.5 w-3.5 text-amber-400" />
            <span>3-Min Demo Guide</span>
          </button>
        </div>
      </div>

      {/* Tab 1: About & Disclosure */}
      {activeTab === "about" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Methodology & Tech */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold uppercase">
              <Code2 className="h-4 w-4" />
              <span>Technology &amp; Architecture</span>
            </div>
            <h3 className="text-base font-bold text-white">Full-Stack Client-Side Synthesizer</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Built on <strong>Next.js 15</strong>, <strong>React 19</strong>, <strong>TypeScript 5</strong>, and <strong>Tailwind CSS</strong>. All symbolic search heuristics run deterministically in the client browser in under 1 millisecond without reliance on external cloud APIs or proprietary black-box inference engines.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1 text-[10px] font-mono text-cyan-300">
              <span className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/20">Next.js 15</span>
              <span className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/20">React 19</span>
              <span className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/20">Recharts</span>
              <span className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/20">Framer Motion</span>
            </div>
          </div>

          {/* AI Assistance Disclosure (Mandatory Hackathon Section) */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-indigo-500/30 space-y-3">
            <div className="flex items-center space-x-2 text-indigo-400 font-mono text-xs font-bold uppercase">
              <ShieldCheck className="h-4 w-4" />
              <span>AI-Assistance Disclosure</span>
            </div>
            <h3 className="text-base font-bold text-white">Ethical &amp; Transparent Development</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              In adherence with the hackathon code of integrity: Large language models were leveraged strictly as pair-programming assistants for boilerplate structuring, typography alignment, and test case scaffolding. All core symbolic grammars, pruning heuristics, and educational curriculum were verified and authored by the project team.
            </p>
            <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-400">
              Status: 100% Disclosed &bull; Open-Source License
            </div>
          </div>

          {/* Credits & Benchmark Heritage */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center space-x-2 text-purple-400 font-mono text-xs font-bold uppercase">
              <Sparkles className="h-4 w-4" />
              <span>Credits &amp; Acknowledgements</span>
            </div>
            <h3 className="text-base font-bold text-white">Pioneering Benchmark Creators</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Sincere gratitude to <strong>François Chollet</strong> and the <strong>ARC Prize Foundation</strong> for establishing the Abstraction and Reasoning Corpus, and the authors of the <strong>BDH-CQ (Pathway)</strong> architecture for demonstrating how recurrent continuous memory expands the frontier of abstract reasoning.
            </p>
            <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-purple-300">
              ARC-AGI-1 Benchmark &bull; 100% Free Educational Artifact
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Monetization Plan (from Poster) */}
      {activeTab === "monetization" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/30 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  Commercialization &amp; Sustainability Model
                </h3>
                <p className="text-xs text-slate-400">
                  Four distinct tiers bridging academic experimentation with institutional adoption.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Pillar 1 */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold">Tier 01</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/20">
                  Freemium
                </span>
              </div>
              <h4 className="text-sm font-bold text-white flex items-center space-x-1.5">
                <GraduationCap className="h-4 w-4 text-cyan-400" />
                <span>Education SaaS</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Free Tier:</strong> Basic demonstration experiments for K-12 and undergraduate classrooms.
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Paid Tier:</strong> Advanced ARC challenge banks, batch student evaluations, and rule entropy telemetry exports.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold">Tier 02</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/20">
                  Subscription
                </span>
              </div>
              <h4 className="text-sm font-bold text-white flex items-center space-x-1.5">
                <Users className="h-4 w-4 text-indigo-400" />
                <span>Professor / Educator Suite</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Custom microworld curriculum authoring, real-time student reasoning progress tracking, and automated explain-back grading metrics.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-purple-400 font-bold">Tier 03</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/20">
                  Enterprise
                </span>
              </div>
              <h4 className="text-sm font-bold text-white flex items-center space-x-1.5">
                <Building2 className="h-4 w-4 text-purple-400" />
                <span>Institutional Licensing</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Campus-wide and research institute site licenses with private cloud deployment, Databricks/GCP pipelines, and research lab benchmark integrations.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">Tier 04</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/20">
                  Roadmap
                </span>
              </div>
              <h4 className="text-sm font-bold text-white flex items-center space-x-1.5">
                <Layers className="h-4 w-4 text-emerald-400" />
                <span>Future Expansion Modules</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Expansion modules covering episodic memory banks, multi-hop symbolic planning, self-reflective attention mechanisms, and physics engine priors.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: 3-Minute Demo Pitch Guide */}
      {activeTab === "pitch" && (
        <div className="space-y-5">
          {/* Timer Card */}
          <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-lg bg-amber-500/20 text-amber-300 font-mono font-bold text-sm">
                ⏱ {Math.floor(pitchSeconds / 60)}:{(pitchSeconds % 60).toString().padStart(2, "0")} / 3:00
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  3-Minute Hackathon Demo Practice Mode
                </h4>
                <p className="text-xs text-slate-400">
                  Follow the exact pacing recommended in the review guide to impress judges in 180 seconds.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsPitchRunning(!isPitchRunning)}
                className={`px-4 py-2 rounded-lg text-xs font-mono font-bold flex items-center space-x-1.5 transition ${
                  isPitchRunning
                    ? "bg-amber-600 text-white"
                    : "bg-emerald-600 hover:bg-emerald-500 text-white"
                }`}
              >
                {isPitchRunning ? (
                  <>
                    <Pause className="h-3.5 w-3.5" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5" />
                    <span>Start Demo Timer</span>
                  </>
                )}
              </button>

              <button
                onClick={handleResetPitch}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                title="Reset Timer"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Step Timeline Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {PITCH_STEPS.map((step, idx) => {
              const isCurrent = isPitchRunning && currentPitchStepIndex === idx;
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border transition space-y-2 flex flex-col justify-between ${
                    isCurrent
                      ? "bg-amber-950/50 border-amber-400 ring-2 ring-amber-400/40 shadow-lg"
                      : "bg-slate-900/80 border-slate-800"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-amber-300 font-bold border border-amber-500/20">
                        {step.timeRange}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-bold animate-pulse">
                          ACTIVE CUE
                        </span>
                      )}
                    </div>
                    <h5 className="text-xs font-bold text-white mt-1">{step.title}</h5>
                    <p className="text-[11px] text-slate-400 mt-1">{step.action}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-800">
                    <span className="text-[10px] font-mono uppercase text-slate-500 block mb-0.5">
                      Suggested Script:
                    </span>
                    <p className="text-[11px] text-slate-300 italic font-serif leading-snug">
                      {step.scriptCue}
                    </p>
                    <button
                      onClick={() => scrollToSection(step.sectionTarget)}
                      className="mt-2 text-[10px] font-mono text-cyan-400 hover:underline flex items-center space-x-1"
                    >
                      <span>Jump to section</span>
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
