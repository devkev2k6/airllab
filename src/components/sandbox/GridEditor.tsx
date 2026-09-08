"use client";

import React, { useEffect, useState } from "react";
import { Grid, ARC_COLORS, ArcColor } from "@/lib/arc/types";
import { GridCell } from "./GridCell";
import { RotateCcw, Shuffle, Maximize2, Paintbrush } from "lucide-react";

interface GridEditorProps {
  grid: Grid;
  onChange?: (newGrid: Grid) => void;
  title?: string;
  isReadOnly?: boolean;
  size?: "sm" | "md" | "lg";
  diffStatuses?: ("match" | "mismatch" | "default")[][];
  confidenceGrid?: number[][];
  showConfidence?: boolean;
  allowResize?: boolean;
}

export function GridEditor({
  grid,
  onChange,
  title,
  isReadOnly = false,
  size = "md",
  diffStatuses,
  confidenceGrid,
  showConfidence = false,
  allowResize = false,
}: GridEditorProps) {
  const [selectedColor, setSelectedColor] = useState<ArcColor>(1);

  // Keyboard shortcut listener for digits 0-9
  useEffect(() => {
    if (isReadOnly) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when typing in text inputs
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }
      const num = parseInt(e.key, 10);
      if (!isNaN(num) && num >= 0 && num <= 9) {
        setSelectedColor(num as ArcColor);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isReadOnly]);

  const handleCellClick = (r: number, c: number) => {
    if (isReadOnly || !onChange) return;
    const newGrid = grid.map((rowArr, rowIdx) =>
      rowArr.map((cellVal, colIdx) => {
        if (rowIdx === r && colIdx === c) {
          // If clicking with already selected color, toggle back to 0
          return cellVal === selectedColor ? 0 : selectedColor;
        }
        return cellVal;
      })
    );
    onChange(newGrid);
  };

  const handleClear = () => {
    if (isReadOnly || !onChange) return;
    const newGrid = grid.map((row) => row.map(() => 0));
    onChange(newGrid);
  };

  const handleFillAll = () => {
    if (isReadOnly || !onChange) return;
    const newGrid = grid.map((row) => row.map(() => selectedColor));
    onChange(newGrid);
  };

  const handleRandomize = () => {
    if (isReadOnly || !onChange) return;
    const H = grid.length;
    const W = grid[0].length;
    const newGrid = Array.from({ length: H }, () =>
      Array.from({ length: W }, () => {
        return Math.random() < 0.4 ? (Math.floor(Math.random() * 9) + 1) : 0;
      })
    );
    onChange(newGrid);
  };

  const handleResize = (newSize: number) => {
    if (isReadOnly || !onChange) return;
    const newGrid: Grid = Array.from({ length: newSize }, (_, r) =>
      Array.from({ length: newSize }, (_, c) => {
        return grid[r]?.[c] ?? 0;
      })
    );
    onChange(newGrid);
  };

  const H = grid?.length || 3;
  const W = grid?.[0]?.length || 3;

  return (
    <div className="flex flex-col items-center bg-slate-900/70 p-3 sm:p-4 rounded-xl border border-slate-800 shadow-sm">
      {/* Title & Dimension info */}
      <div className="w-full flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {title && <span className="font-semibold text-xs sm:text-sm text-slate-200">{title}</span>}
          <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded">
            {H}×{W}
          </span>
        </div>

        {!isReadOnly && allowResize && onChange && (
          <div className="flex items-center space-x-1 text-[10px] font-mono text-slate-400">
            <span>Size:</span>
            {[3, 4, 5, 6].map((s) => (
              <button
                key={s}
                onClick={() => handleResize(s)}
                className={`px-1.5 py-0.5 rounded transition ${
                  H === s
                    ? "bg-cyan-500 text-black font-bold"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {s}×{s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid Canvas */}
      <div
        className="inline-grid gap-1 p-2 rounded-lg bg-slate-950 border border-slate-800/90 shadow-inner"
        style={{
          gridTemplateColumns: `repeat(${W}, minmax(0, 1fr))`,
        }}
      >
        {grid.map((row, r) =>
          row.map((val, c) => (
            <GridCell
              key={`${r}-${c}`}
              value={val}
              row={r}
              col={c}
              size={size}
              isInteractive={!isReadOnly}
              onClick={handleCellClick}
              diffStatus={diffStatuses?.[r]?.[c] || "default"}
              confidence={confidenceGrid?.[r]?.[c]}
              showConfidence={showConfidence}
            />
          ))
        )}
      </div>

      {/* Interactive Toolbar for Editable Grids */}
      {!isReadOnly && onChange && (
        <div className="w-full mt-3 space-y-2">
          {/* Color Palette (0-9) */}
          <div className="flex items-center justify-center gap-1 flex-wrap">
            {(Object.keys(ARC_COLORS) as unknown as ArcColor[]).map((colorKey) => {
              const color = ARC_COLORS[colorKey];
              const isSelected = selectedColor === color.id;
              return (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => setSelectedColor(color.id)}
                  title={`${color.id}: ${color.name} (Key: ${color.id})`}
                  style={{ backgroundColor: color.hex }}
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded text-[10px] font-mono font-bold flex items-center justify-center transition-all ${
                    isSelected
                      ? "ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-900 scale-110 shadow-md"
                      : "opacity-80 hover:opacity-100 hover:scale-105"
                  }`}
                >
                  <span style={{ color: color.textColor }}>{color.id}</span>
                </button>
              );
            })}
          </div>

          {/* Action buttons (Clear, Random, Fill) */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] text-slate-500 font-mono">Active:</span>
              <span
                className="inline-block w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: ARC_COLORS[selectedColor].hex }}
              />
              <span className="text-slate-300 font-mono text-[10px]">
                {ARC_COLORS[selectedColor].name}
              </span>
            </div>

            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={handleClear}
                title="Reset grid to Black (0)"
                className="p-1 px-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition flex items-center space-x-1"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Clear</span>
              </button>
              <button
                type="button"
                onClick={handleRandomize}
                title="Randomize cells"
                className="p-1 px-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition flex items-center space-x-1"
              >
                <Shuffle className="h-3 w-3" />
                <span>Random</span>
              </button>
              <button
                type="button"
                onClick={handleFillAll}
                title="Fill all cells with selected color"
                className="p-1 px-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition flex items-center space-x-1"
              >
                <Paintbrush className="h-3 w-3" />
                <span>Fill</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
