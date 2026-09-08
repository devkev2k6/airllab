"use client";

import React from "react";
import { Sparkles, Compass, Moon, Sun, Cpu, FlaskConical, Layers, Award } from "lucide-react";

interface NavigationProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onStartTour: () => void;
  unlockedBadgeCount: number;
}

export function Navigation({
  darkMode,
  setDarkMode,
  onStartTour,
  unlockedBadgeCount,
}: NavigationProps) {
  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    if (next) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md border-b transition-colors bg-slate-950/80 border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-md shadow-cyan-500/20">
            <FlaskConical className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                AI Rule Learning Lab
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                ARC-AGI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              See • Learn • Experiment • Understand: Not just answers, but the thinking behind them.
            </p>
          </div>
        </div>

        {/* Center Quick Jump Links */}
        <nav className="hidden lg:flex items-center space-x-1 text-xs font-medium text-slate-400">
          <button
            onClick={() => scrollToSection("concept")}
            className="px-2 py-1.5 rounded hover:text-cyan-400 hover:bg-slate-900 transition"
          >
            Concept
          </button>
          <button
            onClick={() => scrollToSection("sandbox")}
            className="px-2 py-1.5 rounded hover:text-cyan-400 hover:bg-slate-900 transition"
          >
            Demo Lab
          </button>
          <button
            onClick={() => scrollToSection("experiment")}
            className="px-2 py-1.5 rounded hover:text-indigo-400 hover:bg-slate-900 transition"
          >
            Experiments
          </button>
          <button
            onClick={() => scrollToSection("failure-lab")}
            className="px-2 py-1.5 rounded hover:text-rose-400 hover:bg-slate-900 transition"
          >
            Why AI Failed
          </button>
          <button
            onClick={() => scrollToSection("bdh-cq")}
            className="px-2 py-1.5 rounded hover:text-purple-400 hover:bg-slate-900 transition"
          >
            BDH-CQ
          </button>
          <button
            onClick={() => scrollToSection("challenge")}
            className="px-2 py-1.5 rounded hover:text-amber-400 hover:bg-slate-900 transition flex items-center space-x-1"
          >
            <span>Challenge</span>
            <span className="px-1 py-0.2 text-[9px] bg-amber-500/20 text-amber-300 rounded font-mono">
              VS
            </span>
          </button>
          <button
            onClick={() => scrollToSection("summary-quiz")}
            className="px-2 py-1.5 rounded hover:text-cyan-400 hover:bg-slate-900 transition"
          >
            Quiz
          </button>
          <button
            onClick={() => scrollToSection("research")}
            className="px-2 py-1.5 rounded hover:text-indigo-400 hover:bg-slate-900 transition"
          >
            Research
          </button>
          <button
            onClick={() => scrollToSection("about")}
            className="px-2 py-1.5 rounded hover:text-emerald-400 hover:bg-slate-900 transition"
          >
            About
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition border border-transparent hover:border-slate-700"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            onClick={onStartTour}
            className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 hover:border-cyan-500/40 transition shadow-sm"
          >
            <Compass className="h-3.5 w-3.5 text-cyan-400" />
            <span>60-Sec Tour</span>
          </button>

          <button
            onClick={() => scrollToSection("sandbox")}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-md shadow-indigo-500/25 transition transform active:scale-95"
          >
            <span>Start Experimenting</span>
          </button>
        </div>
      </div>
    </header>
  );
}
