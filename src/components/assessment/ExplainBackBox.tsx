"use client";

import React, { useState } from "react";
import { Task } from "@/lib/arc/types";
import { MessageSquareText, CheckCircle2, HelpCircle, Sparkles, Send } from "lucide-react";
import confetti from "canvas-confetti";

interface ExplainBackBoxProps {
  currentTask: Task;
  onExplainSuccess: (taskId: string) => void;
  masteredTaskIds: string[];
}

export function ExplainBackBox({
  currentTask,
  onExplainSuccess,
  masteredTaskIds,
}: ExplainBackBoxProps) {
  const [userInput, setUserInput] = useState("");
  const [validationResult, setValidationResult] = useState<{
    status: "idle" | "success" | "partial" | "hint";
    matchedKeywords: string[];
    feedback: string;
  }>({ status: "idle", matchedKeywords: [], feedback: "" });

  const isAlreadyMastered = masteredTaskIds.includes(currentTask.id);

  const handleValidate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userInput.trim()) return;

    const lowerInput = userInput.toLowerCase();
    const matched = currentTask.conceptKeywords.filter((kw) =>
      lowerInput.includes(kw.toLowerCase())
    );

    const matchRatio = matched.length / Math.max(1, currentTask.conceptKeywords.length);

    if (matchRatio >= 0.5 || matched.length >= 2) {
      setValidationResult({
        status: "success",
        matchedKeywords: matched,
        feedback: `Brilliant! You correctly identified the core rule mechanisms: [${matched.join(", ")}]. Rule ground truth: "${currentTask.expectedRuleDescription}"`,
      });

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
      });

      onExplainSuccess(currentTask.id);
    } else if (matched.length === 1) {
      setValidationResult({
        status: "partial",
        matchedKeywords: matched,
        feedback: `Good observation on "${matched[0]}", but consider the full spatial or color transformation. What happens to the other elements or axes?`,
      });
    } else {
      setValidationResult({
        status: "hint",
        matchedKeywords: [],
        feedback: `Not quite. Hint: Look at directional changes, orientation, or whether specific colors map to new values. Ground concept keywords relate to: [${currentTask.conceptKeywords.slice(0, 2).join(", ")}].`,
      });
    }
  };

  return (
    <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MessageSquareText className="h-5 w-5 text-indigo-400" />
          <h3 className="text-base font-bold text-white">
            &ldquo;Explain-Back&rdquo; Cognitive Assessment
          </h3>
        </div>

        {isAlreadyMastered && (
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded flex items-center space-x-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Mastered Task</span>
          </span>
        )}
      </div>

      <p className="text-xs text-slate-400">
        Type your plain-English interpretation of the transformation rule. The semantic validator checks for concept alignment, directions, and color relationships.
      </p>

      <form onSubmit={handleValidate} className="space-y-3">
        <div className="relative">
          <textarea
            rows={2}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={`Explain what happens between Input and Output in "${currentTask.name}"...`}
            className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition resize-none"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">
            Keywords needed: {currentTask.conceptKeywords.join(", ")}
          </span>

          <button
            type="submit"
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-950/50 transition flex items-center space-x-1.5"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Submit Explanation</span>
          </button>
        </div>
      </form>

      {validationResult.status !== "idle" && (
        <div
          className={`p-3 rounded-xl border text-xs flex items-start space-x-2.5 animate-in fade-in ${
            validationResult.status === "success"
              ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-200"
              : validationResult.status === "partial"
              ? "bg-amber-950/40 border-amber-500/40 text-amber-200"
              : "bg-slate-800 border-slate-700 text-slate-300"
          }`}
        >
          {validationResult.status === "success" ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <HelpCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          )}
          <div className="space-y-1">
            <span className="font-bold block">
              {validationResult.status === "success"
                ? "Concept Verified!"
                : validationResult.status === "partial"
                ? "Partial Alignment"
                : "Explore Further"}
            </span>
            <p className="text-[11px] opacity-90 leading-relaxed">
              {validationResult.feedback}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
