"use client";

import React, { useState, useMemo, useEffect } from "react";
import { TASK_BANK } from "@/lib/arc/task-bank";
import { Task, DemonstrationPair, Grid, Badge } from "@/lib/arc/types";
import { runSymbolicSynthesis, cloneGrid } from "@/lib/engine/symbolic-engine";
import { Navigation } from "@/components/hero/Navigation";
import { Hero } from "@/components/hero/Hero";
import { DemonstrationSandbox } from "@/components/sandbox/DemonstrationSandbox";
import { HypothesisViewer } from "@/components/engine/HypothesisViewer";
import { DiffMatrix } from "@/components/engine/DiffMatrix";
import { BdhFrontierModule } from "@/components/bdh/BdhFrontierModule";
import { ExplainBackBox } from "@/components/assessment/ExplainBackBox";
import { LiveMetricsChart } from "@/components/assessment/LiveMetricsChart";
import { BadgesPanel } from "@/components/assessment/BadgesPanel";
import { GuidedTour } from "@/components/tour/GuidedTour";
import confetti from "canvas-confetti";
import { Cpu, ShieldCheck, Sparkles, BookOpen } from "lucide-react";

export default function Home() {
  // Theme state
  const [darkMode, setDarkMode] = useState(true);

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

  // Rule breaker callback
  const handleRuleBroken = () => {
    unlockBadge("rule-breaker");
  };

  // Explain-back callback
  const handleExplainSuccess = (taskId: string) => {
    if (!masteredTaskIds.includes(taskId)) {
      const nextMastered = [...masteredTaskIds, taskId];
      setMasteredTaskIds(nextMastered);
      if (nextMastered.length >= 3) {
        unlockBadge("pattern-master");
      }
    }
  };

  // BDH explorer callback
  const handleBdhExplored = () => {
    unlockBadge("bdh-explorer");
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navigation */}
      <Navigation
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onStartTour={() => setIsTourOpen(true)}
        unlockedBadgeCount={badges.filter((b) => b.unlocked).length}
      />

      {/* Hero Header */}
      <Hero
        onStartTour={() => setIsTourOpen(true)}
        onStartExperimenting={() => scrollToSection("sandbox")}
      />

      {/* Main Lab Content */}
      <main className="flex-1 space-y-12 pb-16">
        {/* Module 2: Interactive Puzzle & Demonstration Sandbox */}
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
        />

        {/* Module 3: Rule Induction Engine & Comparison Matrix */}
        <section className="py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
          <HypothesisViewer
            predictionResult={predictionResult}
            demoCount={demoCount}
          />

          <DiffMatrix
            expectedGrid={currentTask.testCase.expectedOutput}
            predictedGrid={predictionResult.predictedGrid}
            predictionResult={predictionResult}
          />
        </section>

        {/* Module 4: BDH-CQ Frontier Architecture Module */}
        <BdhFrontierModule
          taskName={currentTask.name}
          demoCount={demoCount}
          onExploreCompleted={handleBdhExplored}
        />

        {/* Module 5: Learner Assessment, Telemetry & Gamification */}
        <section className="py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
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
      </main>

      {/* Guided Tour Modal */}
      <GuidedTour
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onNavigateSection={scrollToSection}
      />

      {/* Lab Footer with Official Literature Citations */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Cpu className="h-4 w-4 text-cyan-400" />
            <span className="text-slate-400 font-bold">AI Rule Learning Lab</span>
            <span>• Educational ARC-AGI Cognitive Architecture Lab</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px]">
            <span>BDH-CQ Reference: arXiv:2407.xxxxx (Pathway Track)</span>
            <span>•</span>
            <span>ARC-AGI Benchmark: François Chollet</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
