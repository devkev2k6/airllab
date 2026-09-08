import { BdhLatentStep } from "../arc/types";

export interface ArchitecturalComparison {
  dimension: string;
  toyModel: string;
  bdhCq: string;
  standardLlm: string;
}

export const ARCHITECTURAL_COMPARISONS: ArchitecturalComparison[] = [
  {
    dimension: "Core Mechanism",
    toyModel: "Deterministic Symbolic Synthesis (Discrete hypothesis pruning)",
    bdhCq: "Recurrent Latent State Accumulation (Continuous associative attractor)",
    standardLlm: "Autoregressive Next-Token Prediction (Transformer attention)",
  },
  {
    dimension: "Model Parameters",
    toyModel: "0 parameters (Handcrafted rule synthesizer)",
    bdhCq: "150 Million parameters (Post-Transformer architecture)",
    standardLlm: "7B – 70B+ parameters (Dense or MoE)",
  },
  {
    dimension: "Inference-Time Adaptation",
    toyModel: "Rule filter over grammar",
    bdhCq: "Zero parameter updates (∇W = 0); purely internal recurrent state Sk update",
    standardLlm: "In-context learning via prompt KV-cache attention",
  },
  {
    dimension: "Memory Scaling per Demo",
    toyModel: "O(H) hypothesis pruning",
    bdhCq: "O(1) constant fixed latent size (recurrent state Sk preserves dimensionality)",
    standardLlm: "O(N²) quadratic attention KV-cache growth",
  },
  {
    dimension: "Verbal Reasoning / CoT",
    toyModel: "Explicit programmatic trace",
    bdhCq: "Zero verbal chain-of-thought (pure non-verbal latent processing)",
    standardLlm: "Extensive verbal chain-of-thought required for spatial reasoning",
  },
  {
    dimension: "Cost & ARC-AGI-1 Benchmark",
    toyModel: "Free (Client-side <10ms)",
    bdhCq: "29.5% Accuracy @ $0.0007 / task (Pathway primary literature)",
    standardLlm: "15% – 35% Accuracy @ $0.10 – $3.00 / task (Significant API overhead)",
  },
  {
    dimension: "Noise Robustness",
    toyModel: "Brittle (Single cell error can invalidate hypothesis)",
    bdhCq: "Graceful continuous degradation in latent manifold",
    standardLlm: "Sensitive to prompt formatting and grid tokenization bugs",
  },
];

export function generateLatentSteps(taskName: string, demoCount: number = 3): BdhLatentStep[] {
  // Deterministic seed generation based on task name
  const baseSeed = taskName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const steps: BdhLatentStep[] = [
    {
      stepIndex: 0,
      label: "S₀: Universal ARC Prior",
      description:
        "Initial recurrent state S₀ loaded with general inductive biases (objectness, grid topology, color conservation).",
      latentVector: [0.12, 0.15, 0.08, 0.14, 0.09, 0.11, 0.13, 0.10, 0.12, 0.14, 0.07, 0.11, 0.15, 0.09, 0.13, 0.12],
      entropy: 3.82,
      associativeMagnitude: 0.15,
      convergedFeatures: ["Grid spatial metric", "Primitive color alphabet"],
    },
    {
      stepIndex: 1,
      demonstrationId: 1,
      label: "S₁ = U(S₀, D₁)",
      description:
        "First demonstration ingested. Latent state activates directional manifold; hypotheses contract from global space.",
      latentVector: [0.45, 0.62, 0.15, 0.28, 0.71, 0.22, 0.18, 0.54, 0.31, 0.40, 0.19, 0.68, 0.35, 0.29, 0.58, 0.42],
      entropy: 2.14,
      associativeMagnitude: 0.58,
      convergedFeatures: ["Spatial orientation detected", "Candidate invariant manifold activated"],
    },
    {
      stepIndex: 2,
      demonstrationId: 2,
      label: "S₂ = U(S₁, D₂)",
      description:
        "Second demonstration ingested. Disambiguates candidate symmetries (e.g. rotation vs. reflection vs. transposition).",
      latentVector: [0.78, 0.88, 0.11, 0.19, 0.92, 0.14, 0.12, 0.81, 0.18, 0.22, 0.10, 0.89, 0.21, 0.17, 0.84, 0.31],
      entropy: 0.96,
      associativeMagnitude: 0.84,
      convergedFeatures: ["Symmetry disambiguated", "Color mapping isolated", "Affine coordinate transform locked"],
    },
    {
      stepIndex: 3,
      demonstrationId: 3,
      label: "S₃ = U(S₂, D₃)",
      description:
        "Third demonstration ingested. Latent trajectory reaches stable attractor basin. Rule invariant fully consolidated.",
      latentVector: [0.94, 0.97, 0.05, 0.08, 0.98, 0.06, 0.04, 0.95, 0.09, 0.11, 0.03, 0.96, 0.10, 0.07, 0.97, 0.15],
      entropy: 0.22,
      associativeMagnitude: 0.97,
      convergedFeatures: ["Rule invariant fully settled", "Zero-shot generalization ready", "Continuous attractor basin reached"],
    },
    {
      stepIndex: 4,
      label: "Query: Decoder(Sₖ, I_test) → O_pred",
      description:
        "Test input grid I_test evaluated through the stationary recurrent state S₃ without any test-time gradient updates.",
      latentVector: [0.98, 0.99, 0.02, 0.04, 0.99, 0.03, 0.02, 0.98, 0.05, 0.06, 0.01, 0.99, 0.04, 0.03, 0.99, 0.08],
      entropy: 0.05,
      associativeMagnitude: 0.99,
      convergedFeatures: ["Prediction decoded under 2ms", "100% cell activation certainty"],
    },
  ];

  return steps.slice(0, Math.min(demoCount + 2, 5));
}
