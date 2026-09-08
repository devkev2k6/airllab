"use client";

import React from "react";
import { Badge } from "@/lib/arc/types";
import { Award, ShieldAlert, Sparkles, Brain, CheckCircle2, Lock } from "lucide-react";

interface BadgesPanelProps {
  badges: Badge[];
}

export function BadgesPanel({ badges }: BadgesPanelProps) {
  const getIcon = (id: string, unlocked: boolean) => {
    const iconClass = `h-6 w-6 ${unlocked ? "text-amber-400" : "text-slate-600"}`;
    if (id === "rule-breaker") return <ShieldAlert className={iconClass} />;
    if (id === "pattern-master") return <Sparkles className={iconClass} />;
    if (id === "bdh-explorer") return <Brain className={iconClass} />;
    return <Award className={iconClass} />;
  };

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div id="assessment" className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Award className="h-5 w-5 text-amber-400" />
          <h3 className="text-base font-bold text-white">Learner Achievements &amp; Badges</h3>
        </div>

        <span className="text-xs font-mono text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2.5 py-1 rounded-full font-bold">
          {unlockedCount} of {badges.length} Badges Unlocked
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {badges.map((badge) => {
          return (
            <div
              key={badge.id}
              className={`p-4 rounded-xl border flex items-start space-x-3 transition-all ${
                badge.unlocked
                  ? "bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border-amber-500/50 shadow-lg shadow-amber-950/30 ring-1 ring-amber-500/30"
                  : "bg-slate-950/50 border-slate-800 opacity-60"
              }`}
            >
              <div
                className={`p-2.5 rounded-xl shrink-0 ${
                  badge.unlocked ? "bg-amber-500/20 border border-amber-500/40" : "bg-slate-900 border border-slate-800"
                }`}
              >
                {getIcon(badge.id, badge.unlocked)}
              </div>

              <div className="space-y-1">
                <div className="flex items-center space-x-1.5">
                  <h4 className="font-bold text-sm text-white">{badge.title}</h4>
                  {badge.unlocked ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Lock className="h-3.5 w-3.5 text-slate-600" />
                  )}
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {badge.description}
                </p>

                {badge.unlocked && badge.unlockedAt && (
                  <span className="text-[10px] font-mono text-amber-300 block pt-1">
                    Unlocked • {badge.unlockedAt}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
