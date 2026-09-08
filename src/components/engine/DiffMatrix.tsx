"use client";

import React, { useState } from "react";
import { Grid, PredictionResult } from "@/lib/arc/types";
import { GridEditor } from "../sandbox/GridEditor";
import { CheckCircle2, XCircle, Eye, SlidersHorizontal, ArrowLeftRight } from "lucide-react";

interface DiffMatrixProps {
  expectedGrid: Grid;
  predictedGrid: Grid;
  predictionResult: PredictionResult;
}

export function DiffMatrix({
  expectedGrid,
  predictedGrid,
  predictionResult,
}: DiffMatrixProps) {
  const [viewMode, setViewMode] = useState<"standard" | "diff" | "confidence">("diff");

  const H = expectedGrid.length;
  const W = expectedGrid[0]?.length || 0;

  // Build diff status matrix
  let matchingCount = 0;
  let totalCount = H * W;

  const diffStatuses: ("match" | "mismatch" | "default")[][] = Array.from(
    { length: H },
    (_, r) =>
      Array.from({ length: W }, (_, c) => {
        const expectedVal = expectedGrid[r]?.[c];
        const predictedVal = predictedGrid[r]?.[c];
        if (expectedVal === predictedVal) {
          matchingCount++;
          return "match";
        }
        return "mismatch";
      })
  );

  const accuracyPct = totalCount > 0 ? Math.round((matchingCount / totalCount) * 1000) / 10 : 0;
  const isPerfect = matchingCount === totalCount;

  return (
    <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-4">
      {/* Header & Mode Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <ArrowLeftRight className="h-4 w-4 text-cyan-400" />
            <h3 className="text-base font-bold text-white">
              Truth vs. Prediction Comparison Matrix
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Side-by-side evaluation of ground truth against client-synthesized prediction.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setViewMode("diff")}
            className={`px-2.5 py-1 rounded transition flex items-center space-x-1 ${
              viewMode === "diff"
                ? "bg-cyan-500 text-slate-950 font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>Diff Highlight</span>
          </button>
          <button
            onClick={() => setViewMode("confidence")}
            className={`px-2.5 py-1 rounded transition flex items-center space-x-1 ${
              viewMode === "confidence"
                ? "bg-indigo-500 text-white font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>Confidence Heatmap</span>
          </button>
          <button
            onClick={() => setViewMode("standard")}
            className={`px-2.5 py-1 rounded transition flex items-center space-x-1 ${
              viewMode === "standard"
                ? "bg-slate-700 text-white font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>Clean ARC</span>
          </button>
        </div>
      </div>

      {/* Accuracy Status Banner */}
      <div
        className={`p-3 rounded-xl border flex items-center justify-between text-xs font-mono ${
          isPerfect
            ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-300"
            : "bg-rose-950/30 border-rose-500/40 text-rose-300"
        }`}
      >
        <div className="flex items-center space-x-2">
          {isPerfect ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          ) : (
            <XCircle className="h-4 w-4 text-rose-400 shrink-0" />
          )}
          <span>
            {isPerfect
              ? "Exact Match! Prediction perfectly matches ground truth."
              : `Discrepancy detected: ${totalCount - matchingCount} cells mismatch.`}
          </span>
        </div>

        <div className="font-bold text-sm">
          <span>{accuracyPct}% Match</span>
          <span className="text-[11px] opacity-75 ml-1">
            ({matchingCount}/{totalCount} cells)
          </span>
        </div>
      </div>

      {/* Side-by-Side Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center justify-items-center">
        {/* Ground Truth */}
        <div className="flex flex-col items-center w-full max-w-sm">
          <GridEditor
            grid={expectedGrid}
            title="Ground Truth (Expected Output)"
            isReadOnly={true}
            size="md"
          />
          <span className="text-[11px] text-slate-500 font-mono mt-1">
            Target benchmark answer
          </span>
        </div>

        {/* Prediction with Diff / Heatmap */}
        <div className="flex flex-col items-center w-full max-w-sm">
          <GridEditor
            grid={predictedGrid}
            title="Predicted Output Matrix"
            isReadOnly={true}
            size="md"
            diffStatuses={viewMode === "diff" ? diffStatuses : undefined}
            confidenceGrid={predictionResult.confidenceGrid}
            showConfidence={viewMode === "confidence"}
          />
          <div className="flex items-center space-x-3 text-[11px] font-mono mt-1 text-slate-400">
            {viewMode === "diff" && (
              <>
                <span className="flex items-center space-x-1 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                  <span>Green = Match</span>
                </span>
                <span className="flex items-center space-x-1 text-rose-400">
                  <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                  <span>Red = Mismatch</span>
                </span>
              </>
            )}
            {viewMode === "confidence" && (
              <span className="text-cyan-400">
                Overlay shows % certainty per cell based on top hypothesis consensus
              </span>
            )}
            {viewMode === "standard" && (
              <span className="text-slate-500">Pure ARC color representation</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
