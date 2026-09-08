"use client";

import React, { useState, useMemo, useEffect } from "react";
import { TASK_BANK } from "@/lib/arc/task-bank";
import { Task, DemonstrationPair, Grid, Badge } from "@/lib/arc/types";
import { runSymbolicSynthesis, cloneGrid } from "@/lib/engine/symbolic-engine";
import { generateUnseenProblem } from "@/lib/arc/generator";
import { Navigation } from "@/components/hero/Navigation";
import { Hero } from "@/components/hero/Hero";
import { LearnTheConcept } from "@/components/concept/LearnTheConcept";
import { DemonstrationSandbox } from "@/components/sandbox/DemonstrationSandbox";
import { ExperimentMode } from "@/components/experiment/ExperimentMode";
import { HypothesisViewer } from "@/components/engine/HypothesisViewer";
import { DiffMatrix } from "@/components/engine/DiffMatrix";
import { FailureAnalysisLab } from "@/components/failure/FailureAnalysisLab";
import { BdhFrontierModule } from "@/components/bdh/BdhFrontierModule";
import { FinalChallenge } from "@/components/challenge/FinalChallenge";
import { ExplainBackBox } from "@/components/assessment/ExplainBackBox";
import { LiveMetricsChart } from "@/components/assessment/LiveMetricsChart";
import { BadgesPanel } from "@/components/assessment/BadgesPanel";
import { WhatDidYouLearn } from "@/components/assessment/WhatDidYouLearn";
import { ResearchSources } from "@/components/research/ResearchSources";
import { AboutProject } from "@/components/about/AboutProject";
import { GuidedTour } from "@/components/tour/GuidedTour";
import confetti from "canvas-confetti";
import { Cpu, Award } from "lucide-react";

export default function Home() {
  // Theme state: Default to Light Mode
  const [darkMode, setDarkMode] = useState(false);

  // Sync theme with localStorage and document element - DEFAULT TO LIGHT MODE
  useEffect(() => {
    const saved = localStorage.getItem("airllab-theme");
    if (saved === "dark") {
      setDarkMode(true);
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
  }, []);

  const handleSetDarkMode = (val: boolean) => {
    setDarkMode(val);
    try {
      localStorage.setItem("airllab-theme", val ? "dark" : "light");
    } catch {
      // ignore
    }
    if (val) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
  };

  // Guided Tour modal state
  const [isTourOpen, setIsTourOpen] = useState(false);

  // Active Task state
  const [currentTask, setCurrentTask] = useState<Task>(TASK_BANK[0]);
  const [demoCount, setDemoCount] = useState<number>(3);
  const [activeDemonstrations, setActiveDemonstrations] = useState<DemonstrationPair[]>(() =>
    TASK_BANK[0].demonstrations.map((d) => ({
      id: d.id,
      input: cloneGrid(d.input),
      output: cloneGrid(d.output),
    }))
  );
  const [testInput, setTestInput] = useState<Grid>(() =>
    cloneGrid(TASK_BANK[0].testCase.input)
  );
  const [expectedOutput, setExpectedOutput] = useState<Grid>(() =>
    cloneGrid(TASK_BANK[0].testCase.expectedOutput)
  );

  // Gamification & Badges
  const [masteredTaskIds, setMasteredTaskIds] = useState<string[]>([]);
  const [badges, setBadges] = useState<Badge[]>([
    {
      id: "rule-breaker",
      title: "Rule Breaker",
      description: "Craft an adversarial counterexample that exposes ambiguity in the top hypothesis.",
      icon: "shield-alert",
      unlocked: false,
    },
    {
      id: "pattern-master",
      title: "Pattern Master",
      description: "Successfully explain back 3 different ARC transformation rules.",
      icon: "sparkles",
      unlocked: false,
    },
    {
      id: "bdh-explorer",
      title: "BDH Explorer",
      description: "Complete the interactive recurrent latent accumulator walkthrough.",
      icon: "brain",
      unlocked: false,
    },
  ]);

  // Handle switching tasks
  const handleSelectTask = (task: Task) => {
    setCurrentTask(task);
    setActiveDemonstrations(
      task.demonstrations.map((d) => ({
        id: d.id,
        input: cloneGrid(d.input),
        output: cloneGrid(d.output),
      }))
    );
    setTestInput(cloneGrid(task.testCase.input));
    setExpectedOutput(cloneGrid(task.testCase.expectedOutput));
    setDemoCount(Math.min(3, task.demonstrations.length));
  };

  const handleResetTaskDefaults = () => {
    handleSelectTask(currentTask);
  };

  // Update a specific demonstration pair
  const handleUpdateDemonstration = (index: number, updated: DemonstrationPair) => {
    setActiveDemonstrations((prev) => {
      const next = [...prev];
      next[index] = updated;
      return next;
    });
  };

  // Add demonstration pair
  const handleAddDemonstration = () => {
    const H = currentTask.demonstrations[0]?.input.length || 3;
    const W = currentTask.demonstrations[0]?.input[0]?.length || 3;
    const newDemo: DemonstrationPair = {
      id: Date.now(),
      input: Array.from({ length: H }, () => Array(W).fill(0)),
      output: Array.from({ length: H }, () => Array(W).fill(0)),
    };
    setActiveDemonstrations((prev) => [...prev, newDemo]);
    setDemoCount((prev) => prev + 1);
  };

  // Delete demonstration pair
  const handleDeleteDemonstration = (index: number) => {
    if (activeDemonstrations.length <= 1) return;
    setActiveDemonstrations((prev) => prev.filter((_, idx) => idx !== index));
    setDemoCount((prev) => Math.max(1, Math.min(prev, activeDemonstrations.length - 1)));
  };

  // Generate unseen problem dynamically
  const handleGenerateNewProblem = () => {
    const generated = generateUnseenProblem(currentTask);
    setTestInput(generated.input);
    setExpectedOutput(generated.expectedOutput);
  };

  // Run pure symbolic synthesis engine (<10ms client-side)
  const predictionResult = useMemo(() => {
    return runSymbolicSynthesis(
      activeDemonstrations.slice(0, demoCount),
      testInput
    );
  }, [activeDemonstrations, demoCount, testInput]);

  // Badge unlock helper
  const unlockBadge = (badgeId: string) => {
    setBadges((prev) =>
      prev.map((b) => {
        if (b.id === badgeId && !b.unlocked) {
          confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
          return {
            ...b,
            unlocked: true,
            unlockedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          };
        }
        return b;
      })
    );
  };

  // Callbacks
  const handleRuleBroken = () => unlockBadge("rule-breaker");
  const handleBdhExplored = () => unlockBadge("bdh-explorer");

  const handleExplainSuccess = (taskId: string) => {
    if (!masteredTaskIds.includes(taskId)) {
      const nextMastered = [...masteredTaskIds, taskId];
      setMasteredTaskIds(nextMastered);
      if (nextMastered.length >= 3) {
        unlockBadge("pattern-master");
      }
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200 font-sans transition-colors duration-200">
      {/* Top Navigation Bar */}
      <Navigation
        darkMode={darkMode}
        setDarkMode={handleSetDarkMode}
        onStartTour={() => setIsTourOpen(true)}
        unlockedBadgeCount={badges.filter((b) => b.unlocked).length}
      />

      {/* 1. Landing Page / Hero Section */}
      <Hero
        onStartTour={() => setIsTourOpen(true)}
        onStartExperimenting={() => scrollToSection("sandbox")}
      />

      {/* Main Lab Content Container */}
      <main className="flex-1 space-y-12 pb-16">
        {/* 2. Learn the Concept (With Memorization vs Learning) */}
        <LearnTheConcept />

        {/* 3. Interactive Demo Lab (Add/Edit/Delete, Generate New, Poster Preview) */}
        <DemonstrationSandbox
          currentTask={currentTask}
          onSelectTask={handleSelectTask}
          allTasks={TASK_BANK}
          demoCount={demoCount}
          setDemoCount={setDemoCount}
          activeDemonstrations={activeDemonstrations}
          onUpdateDemonstration={handleUpdateDemonstration}
          testInput={testInput}
          onUpdateTestInput={setTestInput}
          predictionResult={predictionResult}
          onRuleBroken={handleRuleBroken}
          onResetTaskDefaults={handleResetTaskDefaults}
          onAddDemonstration={handleAddDemonstration}
          onDeleteDemonstration={handleDeleteDemonstration}
          onGenerateNewProblem={handleGenerateNewProblem}
          expectedOutput={expectedOutput}
        />

        {/* 4. Experiment Mode (Demonstration slider, Difficulty, Noise Injection, Ambiguity) */}
        <ExperimentMode
          demoCount={demoCount}
          setDemoCount={setDemoCount}
          onSelectDifficulty={(lvl) => {
            const match = TASK_BANK.find((t) => t.category === lvl);
            if (match) handleSelectTask(match);
          }}
        />

        {/* Core Induction Engine: Hypotheses Ranking & Comparison Matrix */}
        <section id="engine" className="py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
          <HypothesisViewer
            predictionResult={predictionResult}
            demoCount={demoCount}
          />

          <DiffMatrix
            expectedGrid={expectedOutput}
            predictedGrid={predictionResult.predictedGrid}
            predictionResult={predictionResult}
          />
        </section>

        {/* 5. Why Did AI Fail? (Failure Analysis Lab - 4 Types of Failure) */}
        <FailureAnalysisLab />

        {/* 6. BDH-CQ Connection (Frontier Recurrent Architecture vs Symbolic) */}
        <BdhFrontierModule
          taskName={currentTask.name}
          demoCount={demoCount}
          onExploreCompleted={handleBdhExplored}
        />

        {/* 7. Final Challenge (User vs AI vs Ground Truth 3-Way Showdown) */}
        <FinalChallenge />

        {/* Telemetry & Assessment Hub */}
        <section id="assessment" className="py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ExplainBackBox
              currentTask={currentTask}
              onExplainSuccess={handleExplainSuccess}
              masteredTaskIds={masteredTaskIds}
            />

            <LiveMetricsChart currentDemoCount={demoCount} />
          </div>

          <BadgesPanel badges={badges} />
        </section>

        {/* 8. What Did You Learn? (Interactive Summary & Mini Quiz) */}
        <WhatDidYouLearn />

        {/* 9. Research & Sources (4 Primary Papers) */}
        <ResearchSources />

        {/* 10. About the Project & Monetization Plan (Team, AI Disclosure, SaaS Model & 3-Min Pitch Timer) */}
        <AboutProject />
      </main>

      {/* Guided Tour Modal */}
      <GuidedTour
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onNavigateSection={scrollToSection}
      />

      {/* Lab Footer with Official Literature Citations */}
      <footer className="border-t border-slate-800 bg-[var(--background)] py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 font-mono transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Cpu className="h-4 w-4 text-cyan-400" />
            <span className="text-slate-300 font-bold">AI Rule Learning Lab</span>
            <span>&bull; Skill Acquisition from Demonstrations &bull; Educational Cognitive Architecture Lab</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px]">
            <span>BDH-CQ (Pathway Track)</span>
            <span>&bull;</span>
            <span>ARC-AGI Benchmark (François Chollet)</span>
            <span>&bull;</span>
            <span>DreamCoder (MIT)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
