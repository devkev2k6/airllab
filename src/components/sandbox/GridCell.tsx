"use client";

import React from "react";
import { ARC_COLORS, ArcColor } from "@/lib/arc/types";

interface GridCellProps {
  value: number;
  row: number;
  col: number;
  size?: "sm" | "md" | "lg";
  isInteractive?: boolean;
  onClick?: (r: number, c: number) => void;
  diffStatus?: "match" | "mismatch" | "default";
  confidence?: number; // 0 - 100 for confidence heatmap
  showConfidence?: boolean;
}

export function GridCell({
  value,
  row,
  col,
  size = "md",
  isInteractive = false,
  onClick,
  diffStatus = "default",
  confidence,
  showConfidence = false,
}: GridCellProps) {
  const safeColorId = (Math.max(0, Math.min(9, Math.floor(value))) as ArcColor) || 0;
  const colorMeta = ARC_COLORS[safeColorId] || ARC_COLORS[0];

  const sizeClasses = {
    sm: "w-6 h-6 text-[10px]",
    md: "w-9 h-9 sm:w-10 sm:h-10 text-xs",
    lg: "w-12 h-12 sm:w-14 sm:h-14 text-sm font-bold",
  }[size];

  const handleClick = () => {
    if (isInteractive && onClick) {
      onClick(row, col);
    }
  };

  let borderStyle = "border-slate-800/80";
  let extraGlow = "";

  if (diffStatus === "match") {
    borderStyle = "border-emerald-400 border-2";
    extraGlow = "cell-glow-green";
  } else if (diffStatus === "mismatch") {
    borderStyle = "border-red-500 border-2";
    extraGlow = "cell-glow-red";
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!isInteractive}
      title={`(${row}, ${col}) Color ${safeColorId}: ${colorMeta.name}${
        confidence !== undefined ? ` • Confidence: ${confidence}%` : ""
      }`}
      style={{ backgroundColor: colorMeta.hex }}
      className={`
        ${sizeClasses}
        relative flex items-center justify-center rounded-sm font-mono border
        transition-all duration-150 select-none
        ${borderStyle}
        ${extraGlow}
        ${isInteractive ? "cursor-pointer hover:scale-105 hover:z-10 hover:shadow-md active:scale-95" : "cursor-default"}
      `}
    >
      {/* Show value numeral if non-black or small label */}
      <span
        style={{ color: colorMeta.textColor }}
        className="opacity-75 font-semibold text-[11px] pointer-events-none"
      >
        {value !== 0 ? value : ""}
      </span>

      {/* Confidence overlay badge if active */}
      {showConfidence && confidence !== undefined && (
        <span className="absolute bottom-0 right-0.5 text-[8px] font-mono text-white/90 bg-black/60 px-0.5 rounded pointer-events-none">
          {confidence}%
        </span>
      )}
    </button>
  );
}
