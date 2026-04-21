"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Category =
  | "reporting"
  | "data_flow"
  | "alignment"
  | "process"
  | "structure";

type ResultContent = {
  label: string;
  headline: string;
  snapshot: string;
  looksLike: string[];
  broken: string[];
  missing: string[];
  startHere: string[];
  nextSteps: string[];
  ignore: string[];
  reassurance: string;
};

const resultsMap: Record<Category, ResultContent> = {
  reporting: {
    label: "Reporting & Visibility",
    headline: "Your marketing isn’t unclear. Your reporting isn’t structured.",
    snapshot:
      "Right now, your reporting likely exists, but it doesn’t clearly show what is happening. You have numbers, but they do not tell a clean story.",
    looksLike: [
      "Pulling data together manually",
      "Reports that feel inconsistent",
      "Explaining numbers instead of using them",
      "Uncertainty around what matters",
      "Lack of confidence when sharing updates"
    ],
    broken: [
      "Reporting is not standardized",
      "Metrics are not clearly defined",
      "Data is hard to interpret quickly"
    ],
    missing: [
      "A consistent reporting structure",
      "Clear definitions for key metrics",
      "A simple way to communicate performance"
    ],
    startHere: [
      "Open your last report",
      "Ask: what are the 3 numbers that actually matter?",
      "Ask: can I explain them clearly in one sentence?"
    ],
    nextSteps: [
      "Define the small set of metrics that matter",
      "Remove anything that does not support decisions",
      "Use the same reporting structure every time"
    ],
    ignore: ["More dashboards", "More metrics", "More tools"],
    reassurance:
      "The problem is not a lack of data. It is that your data is not organized to be useful yet."
  },

  data_flow: {
    label: "Tools & Data Flow",
    headline: "Your marketing isn’t broken. Your tools aren’t working together.",
    snapshot:
      "Right now, your setup is likely creating more work than it should. You have the tools and the data, but they were never designed to work together cleanly.",
    looksLike: [
      "Pulling reports from multiple places",
      "Double-checking numbers before sharing",
      "Manually moving data between tools",
      "Not fully trusting what you are looking at",
      "Spending more time fixing than deciding"
    ],
    broken: [
      "Your tools are not properly connected",
      "Data does not flow cleanly between systems",
      "You are relying on manual work to fill the gaps"
    ],
    missing: [
      "A clear source of truth",
      "Clean connections between your core tools",
      "Confidence in your data"
    ],
    startHere: [
      "Open the tools you use for reporting",
      "Write down where each number comes from",
      "Write down how it gets there"
    ],
    nextSteps: [
      "Map where your data actually lives",
      "Remove duplication and unnecessary steps",
      "Decide which numbers actually matter"
    ],
    ignore: ["A new tool", "A full rebuild", "More dashboards"],
    reassurance:
      "Most of what you need is already there. It just has not been structured properly yet."
  },

  alignment: {
    label: "Strategic Alignment",
    headline:
      "Your marketing isn’t underperforming. It’s not clearly connected to outcomes.",
    snapshot:
      "Right now, your work likely feels busy, but not always clearly tied to results. You are doing the work, but it is not always obvious what it is driving.",
    looksLike: [
      "Uncertainty around priorities",
      "Difficulty explaining impact",
      "Work that feels disconnected",
      "Reactive decision-making",
      "An unclear definition of success"
    ],
    broken: [
      "No clear link between activity and outcomes",
      "Priorities are not fully defined",
      "Success is not clearly measured"
    ],
    missing: [
      "Clear expectations for marketing",
      "Defined outcomes",
      "Alignment between activity and results"
    ],
    startHere: [
      "Write down what marketing is supposed to deliver",
      "Write down how that is measured",
      "If that feels unclear, that is the gap"
    ],
    nextSteps: [
      "Define the outcomes marketing is responsible for",
      "Connect work to those outcomes",
      "Measure what reflects real progress"
    ],
    ignore: ["More content", "More campaigns", "More activity"],
    reassurance:
      "This is not about doing more. It is about making sure what you are doing actually connects to something meaningful."
  },

  process: {
    label: "Process & Handover",
    headline: "Your marketing isn’t inconsistent. Your processes aren’t defined.",
    snapshot:
      "Right now, a lot of your work likely depends on memory, context, or you personally. That makes everything harder to repeat and harder to hand over.",
    looksLike: [
      "Tasks done differently each time",
      "Knowledge living in your head",
      "Difficulty delegating",
      "Inconsistent output",
      "Reliance on you to keep things moving"
    ],
    broken: [
      "Processes are not documented",
      "Work is not repeatable",
      "Handover is difficult"
    ],
    missing: [
      "Clear workflows",
      "Documented processes",
      "Consistency in execution"
    ],
    startHere: [
      "Pick one recurring task",
      "Write down the steps",
      "If it feels unclear or inconsistent, that is your gap"
    ],
    nextSteps: [
      "Document what you already do",
      "Remove unnecessary steps",
      "Standardize the workflow"
    ],
    ignore: ["New tools", "Automation", "Scaling systems"],
    reassurance:
      "You do not need to build processes from scratch. You just need to capture what already exists."
  },

  structure: {
    label: "Operational Structure",
    headline:
      "Your marketing isn’t chaotic. Your system doesn’t have a structure yet.",
    snapshot:
      "Right now, your setup likely works, but it feels scattered and harder to manage than it should. There is not a clear system holding everything together.",
    looksLike: [
      "Work spread across multiple tools",
      "Difficulty finding information",
      "Things slipping through the cracks",
      "Reliance on memory",
      "Constant context switching"
    ],
    broken: [
      "No central structure",
      "Information is not organized",
      "The system is fragmented"
    ],
    missing: [
      "A clear system",
      "Organized information",
      "A stable foundation"
    ],
    startHere: [
      "List where your key marketing work lives",
      "Include planning, reporting, content, and assets",
      "If it is spread across places, that is your gap"
    ],
    nextSteps: [
      "Centralize the key parts of your setup",
      "Organize how things are structured",
      "Reduce unnecessary complexity"
    ],
    ignore: ["Adding new tools", "Rebuilding everything", "Complex systems"],
    reassurance:
      "You do not need more. You need less, structured properly."
  }
};

const categoryOrder: Category[] = [
  "reporting",
  "data_flow",
  "alignment",
  "process",
  "structure"
];

const FORM_BASE_URL = "https://link.feacreate.com/widget/form/eJY81SJhHlOz4GnQP7du";

export default function ResultsPage() {
  const [loaded, setLoaded] = useState(false);
  const [primary, setPrimary] = useState<Category | null>(null);
  const [secondary, setSecondary] = useState<Category | null>(null);

  useEffect(() => {
    const rawScores = localStorage.getItem("quiz_scores");
    const rawCounts = localStorage.getItem("quiz_counts");

    if (!rawScores || !rawCounts) {
      setLoaded(true);
      return;
    }

    try {
      const scores = JSON.parse(rawScores) as Record<string, number>;
      const counts = JSON.parse(rawCounts) as Record<string, number>;

      const averages = categoryOrder.map((category) => {
        const total = scores[category] || 0;
        const count = counts[category] || 1;

        return {
          category,
          average: total / count
        };
      });

      averages.sort((a, b) => a.average - b.average);

      setPrimary(averages[0]?.category ?? null);
      setSecondary(averages[1]?.category ?? null);
    } catch {
      localStorage.removeItem("quiz_scores");
      localStorage.removeItem("quiz_counts");
    } finally {
      setLoaded(true);
    }
  }, []);

  const formUrl = useMemo(() => {
    if (!primary) return FORM_BASE_URL;

    const params = new URLSearchParams({
      problem_area: primary,
      secondary_issue: secondary ?? ""
    });

    return `${FORM_BASE_URL}?${params.toString()}`;
  }, [primary, secondary]);

  if (!loaded) {
    return (
      <main className="min-h-screen bg-[#f3efef] px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <p className="text-[#2a1f1c]">Loading your results...</p>
        </div>
      </main>
    );
  }

  if (!primary) {
    return (
      <main className="min-h-screen bg-[#f3efef] px-6 py-16">
        <div className="mx-auto max-w-3xl rounded-2xl border border-[#c9bcad] bg-white p-8">
          <p className="text-sm uppercase tracking-[0.2em] text-[#62493c] mb-3">
            No results found
          </p>
          <h1 className="text-3xl font-semibold text-[#0d0b09] mb-4">
            Start the check first
          </h1>
          <p className="text-[#2a1f1c] mb-6 leading-7">
            We could not find any saved quiz answers yet.
          </p>
          <Link
            href="/quiz"
            className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition hover:opacity-90"
            style={{
              backgroundColor: "#2a1f1c",
              color: "#eedac4"
            }}
          >
            Start the 10-minute check
          </Link>
        </div>
      </main>
    );
  }

  const result = resultsMap[primary];

  return (
    <main className="min-h-screen bg-[#f3efef] px-6 py-12">
      <div className="mx-auto max-w-3xl space-y-6">
        <header>
          <p className="text-xs tracking-[0.2em] uppercase text-[#62493c] mb-3">
            Your result
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold text-[#0d0b09] leading-tight mb-4">
            {result.headline}
          </h1>
          <p className="text-lg text-[#2a1f1c] leading-8">
            {result.snapshot}
          </p>
        </header>

        <section className="rounded-2xl border border-[#c9bcad] bg-white p-6">
          <h2 className="text-xl font-semibold text-[#0d0b09] mb-4">
            What this usually looks like
          </h2>
          <ul className="space-y-3 text-[#2a1f1c]">
            {result.looksLike.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-[#c9bcad] bg-white p-6">
          <h2 className="text-xl font-semibold text-[#0d0b09] mb-4">
            What’s broken
          </h2>
          <ul className="space-y-3 text-[#2a1f1c]">
            {result.broken.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-[#c9bcad] bg-white p-6">
          <h2 className="text-xl font-semibold text-[#0d0b09] mb-4">
            What’s missing
          </h2>
          <ul className="space-y-3 text-[#2a1f1c]">
            {result.missing.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-[#c9bcad] bg-white p-6">
          <h2 className="text-xl font-semibold text-[#0d0b09] mb-4">
            Start here (10 minutes)
          </h2>
          <ul className="space-y-3 text-[#2a1f1c]">
            {result.startHere.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-[#c9bcad] bg-white p-6">
          <h2 className="text-xl font-semibold text-[#0d0b09] mb-4">
            Your 3-step fix path
          </h2>
          <ul className="space-y-3 text-[#2a1f1c]">
            {result.nextSteps.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-[#c9bcad] bg-white p-6">
          <h2 className="text-xl font-semibold text-[#0d0b09] mb-4">
            What to ignore for now
          </h2>
          <ul className="space-y-3 text-[#2a1f1c]">
            {result.ignore.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-[#c9bcad] bg-white p-6">
          <h2 className="text-xl font-semibold text-[#0d0b09] mb-4">
            A useful note
          </h2>
          <p className="text-[#2a1f1c] leading-7">{result.reassurance}</p>
        </section>

        <section className="rounded-2xl border border-[#c9bcad] bg-white p-6">
          <p className="text-xs tracking-[0.2em] uppercase text-[#62493c] mb-2">
            Next step
          </p>
          <h2 className="text-2xl font-semibold text-[#0d0b09] mb-3">
            Send me my full fix plan
          </h2>
          <p className="text-[#2a1f1c] leading-7 mb-6">
            I’ll send you your breakdown, what to fix next, and how to simplify
            this without rebuilding everything.
          </p>

          <a
            href={formUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition hover:opacity-90"
            style={{
              backgroundColor: "#2a1f1c",
              color: "#eedac4"
            }}
          >
            Send me my full fix plan
          </a>
        </section>

        <div className="flex gap-3">
          <Link
            href="/quiz"
            className="inline-flex items-center justify-center rounded-full border border-[#c9bcad] bg-white px-6 py-3 text-sm font-medium text-[#0d0b09] transition hover:opacity-90"
          >
            Retake check
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-[#c9bcad] bg-white px-6 py-3 text-sm font-medium text-[#0d0b09] transition hover:opacity-90"
          >
            Back to start
          </Link>
        </div>
      </div>
    </main>
  );
}