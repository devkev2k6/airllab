# 🧪 AI Rule Learning Lab

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-15.1.7-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![ARC-AGI Benchmark](https://img.shields.io/badge/ARC--AGI_Benchmark-29.5%25_%40_%240.0007-purple?style=for-the-badge)](https://arcprize.org/)
[![Synthesis Latency](https://img.shields.io/badge/Symbolic_Search-%3C1ms_Client--Side-emerald?style=for-the-badge)](https://github.com/)

<p align="center">
  <strong>See • Learn • Experiment • Understand: Not just answers, but the thinking behind them.</strong>
</p>

<p align="center">
  An interactive educational cognitive architecture laboratory demonstrating how AI induces transformation rules from ARC-AGI demonstration pairs via symbolic program synthesis versus how frontier recurrent models (BDH-CQ) operate in continuous latent memory.
</p>

</div>

---

## 📌 Core Empirical Claim

> **"This artifact demonstrates that symbolic rule-induction identifies deterministic 2D affine and color transformations within ≤3 demonstrations, whereas BDH-CQ accumulates non-verbal associations via a 150M recurrent latent state without inference-time weight updates."**

---

## ✨ Key Features & Modules

### 1. 🎨 Interactive ARC Grid Editor & Demonstration Sandbox
* **ARC 10-Color Palette**: Full support for standard ARC colors (`0: Black` to `9: Maroon`) with custom swatches, coordinate inspection, and hotkeys (`0`–`9`).
* **Curated Task Bank**: 9 pre-loaded ARC challenges categorized into:
  * **Easy**: *90° Clockwise Rotation*, *Color Swap (Blue ↔ Red)*, *Vertical Reflection (Flip Y)*.
  * **Medium**: *Horizontal Flip + Recolor (Green → Orange)*, *Frame / Perimeter Extraction*, *Downward Gravity Shift*.
  * **Tricky / Adversarial**: *Count-Based Color Dominance*, *Enclosed Center Fill (Yellow)*, *Bounding-Box Object Crop*.
* **Demonstration Density Slider ($1 \to 4$)**: Dynamically toggle demonstration density to observe candidate rule entropy collapsing in real time.
* **Adversarial "Break the Rule" Sandbox**: Test custom counterexample grids and adversarial presets (rotational symmetries, tie-breaker counts, leaky boundary cages) to expose edge cases and earn the **"Rule Breaker"** badge.

### 2. ⚡ Symbolic Rule Induction Engine (Educational Toy Model)
* **Prominently Labeled**: *Independent Educational Toy Model (Symbolic Synthesis) — NOT official BDH or BDH-CQ*.
* **Blazing Fast**: Deterministic program synthesis running 100% client-side in **~0.97ms** (zero external LLM API dependencies).
* **Primitive Grammars**: 2D rotations ($90^\circ, 180^\circ, 270^\circ$), reflections (horizontal, vertical, transpose), gravity falls, morphological frame/hole extractions, and bijective color algebra.
* **Top-3 Hypotheses Ranking**: Scored using Occam's razor simplicity priors with full reasoning trace logs and disqualification rationales.
* **Truth vs. Prediction Comparison Matrix**: Side-by-side evaluation with green checkmark glow for matching cells, pulsing red highlight for mismatches, and cell-by-cell confidence heatmaps.

### 3. 🧠 BDH-CQ Frontier Architecture Module
* **Clear Literature Demarcation**: Contrasts *"Reported Primary Literature (arXiv/Pathway)"* against *"Our Toy Implementation"*.
* **Recurrent Latent State Accumulator**: Interactive node stepper ($S_0 \to S_1 \to S_2 \to S_3 \to \text{Query}$) demonstrating sequential demonstration digestion:
  $$S_k = U(S_{k-1}, D_k) = U(\dots U(U(S_0, D_1), D_2)\dots, D_k)$$
  $$O_{pred} = \text{Decoder}(S_k, I_{test})$$
* **16-D Activation Heatmap & Uncertainty Gauge**: Visualizes associative energy magnitude ($||S_k||$) and entropy collapse without inference-time gradient updates ($\nabla W = 0$) or token KV-cache growth ($O(1)$ memory).
* **Architectural Matrix**: Deep-dive comparison across Toy Model vs. BDH-CQ vs. Standard Large Language Models (LLMs).

### 4. 🏆 Assessment, Gamification & Live Telemetry
* **"Explain-Back" Cognitive Box**: Natural language rule evaluator that validates spatial, directional, and color concepts with interactive feedback.
* **Live Telemetry Charts (Recharts)**: Dynamic graphs tracking *Accuracy vs. Demonstrations*, *Candidate Rule Entropy Collapse (Bits)*, and *Latency & Cost Benchmarks*.
* **Achievement Badges**: 🏆 *"Rule Breaker"*, 🌟 *"Pattern Master"*, and 🔬 *"BDH Explorer"* with celebratory confetti effects.
* **60-Second Guided Tour**: Interactive multi-step guided tour with auto-play walkthrough mode.

---

## 🛠️ Tech Stack

* **Framework**: [Next.js 15](https://nextjs.org/) (App Router, React 19)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom ARC color tokens & Dark/Light mode
* **Icons**: [Lucide-React](https://lucide.dev/)
* **Animations**: [Framer Motion](https://www.framer.com/motion/) & [Canvas-Confetti](https://www.npmjs.com/package/canvas-confetti)
* **Data Visualization**: [Recharts](https://recharts.org/)
* **Language & Runtime**: TypeScript 5, Node.js 18+

---

## 🚀 Getting Started / Installation Guide

Follow these steps to run the **AI Rule Learning Lab** on any system (Windows, macOS, or Linux).

### Prerequisites
* **Node.js**: `v18.18.0` or higher (Node 20+ / 24+ recommended)
* **npm**: `v9.0.0` or higher (or `pnpm` / `yarn` / `bun`)

Check your installed versions:
```bash
node -v
npm -v
```

---

### Step-by-Step Setup

#### 1. Clone or Open the Repository
```bash
git clone <repository-url>
cd airllab
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Run the Development Server
```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:3000
```

---

### 📦 Production Build & Deployment

To build an optimized static production bundle:

```bash
# 1. Build the production application
npm run build

# 2. Start the production server
npm run start
```
The production server will listen on `http://localhost:3000`.

---

## 🧪 Automated Testing & Rule Engine Verification

You can run the built-in deterministic benchmark script to verify that the symbolic engine solves all 9 task bank challenges:

```bash
npx tsx scripts/verify-tasks.ts
```

### Benchmark Output:
```text
=================================================
ARC-AGI Rule Induction Engine Benchmark & Audit
=================================================

[Task] 90° Clockwise Rotation (Easy)        -> PASS (100%) [2.53 ms]
[Task] Color Swap (Blue ↔ Red) (Easy)        -> PASS (100%) [0.80 ms]
[Task] Vertical Reflection (Flip Y) (Easy)   -> PASS (100%) [0.37 ms]
[Task] Horizontal Flip + Recolor (Medium)    -> PASS (100%) [1.28 ms]
[Task] Frame / Perimeter Extraction (Medium) -> PASS (100%) [0.58 ms]
[Task] Downward Gravity Shift (Medium)       -> PASS (100%) [0.42 ms]
[Task] Count-Based Color Dominance (Tricky)  -> PASS (100%) [0.36 ms]
[Task] Enclosed Center Fill (Tricky)         -> PASS (100%) [1.06 ms]
[Task] Bounding-Box Object Crop (Tricky)     -> PASS (100%) [1.30 ms]

=================================================
Summary: 9 Tasks Tested | Average Latency: 0.97 ms / task
Overall Status : ALL 9 TASKS PASSED (100% ACCURACY)
=================================================
```

---

## 🎨 ARC-AGI 10-Color Standard Reference

| Value | Name | Hex Code | Visual Swatch | Key Shortcut |
| :---: | :---: | :---: | :---: | :---: |
| `0` | Black / Background | `#18181B` | `⬛` | `0` |
| `1` | Blue | `#2563EB` | `🟦` | `1` |
| `2` | Red | `#DC2626` | `🟥` | `2` |
| `3` | Green | `#16A34A` | `🟩` | `3` |
| `4` | Yellow | `#EAB308` | `🟨` | `4` |
| `5` | Grey | `#6B7280` | `◽` | `5` |
| `6` | Magenta | `#C026D3` | `🟪` | `6` |
| `7` | Orange | `#EA580C` | `🟧` | `7` |
| `8` | Teal | `#0D9488` | `🟦` | `8` |
| `9` | Maroon | `#881337` | `🟫` | `9` |

---

## 📂 Project Directory Structure

```text
airllab/
├── src/
│   ├── app/
│   │   ├── globals.css           # ARC glowing styles & dark/light theme
│   │   ├── layout.tsx            # HTML root metadata & layout
│   │   └── page.tsx              # Central laboratory workbench
│   ├── components/
│   │   ├── assessment/
│   │   │   ├── BadgesPanel.tsx   # Achievements & confetti rewards
│   │   │   ├── ExplainBackBox.tsx # Natural language semantic keyword validator
│   │   │   └── LiveMetricsChart.tsx # Recharts accuracy, entropy, latency plots
│   │   ├── bdh/
│   │   │   ├── BdhFrontierModule.tsx # Primary literature demarcation & matrix
│   │   │   └── LatentStateVisualizer.tsx # Recurrent latent node accumulator
│   │   ├── engine/
│   │   │   ├── DiffMatrix.tsx    # Truth vs. Prediction side-by-side diff
│   │   │   └── HypothesisViewer.tsx # Top-3 rule ranking & reasoning traces
│   │   ├── hero/
│   │   │   ├── Hero.tsx          # Hero banner, empirical claim & telemetry
│   │   │   └── Navigation.tsx    # Sticky navbar, theme toggle & 60-sec tour
│   │   ├── sandbox/
│   │   │   ├── BreakTheRuleModal.tsx # Adversarial counterexample testing
│   │   │   ├── DemonstrationSandbox.tsx # Pair editors & density slider
│   │   │   ├── GridCell.tsx      # High-contrast interactive ARC cell
│   │   │   └── GridEditor.tsx    # Clickable palette & grid painting canvas
│   │   └── tour/
│   │       └── GuidedTour.tsx    # 5-step 60-second guided walkthrough
│   └── lib/
│       ├── arc/
│       │   ├── task-bank.ts      # 9 curated ARC challenges & adversarial presets
│       │   └── types.ts          # TypeScript interfaces & ARC color definitions
│       ├── bdh/
│       │   └── bdh-model.ts      # Recurrent latent math & comparison matrix
│       ├── engine/
│       │   └── symbolic-engine.ts # Deterministic program synthesis engine
│       └── utils.ts              # Tailwind className merger
├── scripts/
│   ├── test-assets.mjs           # Asset verification script
│   └── verify-tasks.ts           # Automated benchmark & engine verification
├── Instructions.md               # Original task specifications
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## 📖 Literature Citations & References

1. **ARC-AGI Benchmark**: Chollet, François. *"On the Measure of Intelligence."* arXiv:1911.01548 (2019). [https://arcprize.org](https://arcprize.org)
2. **BDH-CQ Frontier Architecture**: Pathway Research Track. Benchmarked at **29.5% on ARC-AGI-1 at $0.0007 / task** via 150M parameter recurrent continuous latent memory digestion ($S_k = U(S_{k-1}, D_k)$) with zero inference-time parameter updates ($\nabla W = 0$).

---

<div align="center">
  <sub>Built with precision for the AI Rule Learning Lab • Independent Educational Cognitive Architecture Demonstration</sub>
</div>
