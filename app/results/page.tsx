"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Category =
  | "reporting"
  | "data_flow"
  | "alignment"
  | "process"
  | "structure";

type ResultKey = Category | "strong_system" | "system_wide";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    auditResultFired?: boolean;
  }
}

const categoryLabels: Record<Category, string> = {
  reporting: "Reporting & Visibility",
  data_flow: "Tools & Data Flow",
  alignment: "Strategic Alignment",
  process: "Process & Handover",
  structure: "Operational Structure"
};

const LANDING_PAGE_BASE_URL =
  "https://glowsparkdigital.com/audit-ty";

function trackEvent(eventName: string, params?: Record<string, string>) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }
}

export default function ResultsPage() {
  const [loaded, setLoaded] = useState(false);
  const [primary, setPrimary] = useState<ResultKey | null>(null);
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

      const categories: Category[] = [
        "reporting",
        "data_flow",
        "alignment",
        "process",
        "structure"
      ];

      const averages = categories.map((category) => ({
        category,
        average: (scores[category] || 0) / (counts[category] || 1)
      }));

      averages.sort((a, b) => a.average - b.average);

      const primaryCategory = averages[0]?.category ?? null;
      const secondaryCategory = averages[1]?.category ?? null;

      setPrimary(primaryCategory);
      setSecondary(secondaryCategory);

      if (
        typeof window !== "undefined" &&
        typeof window.gtag === "function" &&
        !window.auditResultFired &&
        primaryCategory
      ) {
        window.gtag("event", "audit_result_viewed", {
          problem_area: primaryCategory,
          secondary_issue: secondaryCategory ?? "none",
          result_type: "primary_result",
          funnel_stage: "diagnosis"
        });

        window.auditResultFired = true;
      }
    } catch {
      localStorage.removeItem("quiz_scores");
      localStorage.removeItem("quiz_counts");
    } finally {
      setLoaded(true);
    }
  }, []);

  const formAction = useMemo(() => {
    if (!primary) return LANDING_PAGE_BASE_URL;

    const params = new URLSearchParams({
      problem_area: primary,
      secondary_issue: secondary ?? ""
    });

    return `${LANDING_PAGE_BASE_URL}?${params.toString()}`;
  }, [primary, secondary]);

  if (!loaded) {
    return (
      <main className="min-h-screen bg-[#f3efef] px-6 py-16">
        <p>Loading your results...</p>
      </main>
    );
  }

  if (!primary) {
    return (
      <main className="min-h-screen bg-[#f3efef] px-6 py-16">
        <Link href="/quiz">Start the check</Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f3efef] px-6 py-12">
      <div className="mx-auto max-w-2xl space-y-8">

        <div>
          <h1 className="text-3xl md:text-4xl font-semibold text-[#0d0b09] mb-4">
            Here’s what’s making your marketing feel harder than it should
          </h1>

          <p className="text-[#2a1f1c] mb-6">
            Based on your answers, one part of your setup is creating most of the friction.
          </p>

          <h2 className="text-xl font-semibold text-[#0d0b09] mb-2">
            Your main friction point: {categoryLabels[primary as Category]}
          </h2>

          <p className="text-[#2a1f1c]">
            Your setup is working in places. But it’s not designed to connect.
          </p>
        </div>

        <div className="space-y-4 text-[#2a1f1c]">
          <p>You’re likely pulling numbers from multiple tools.</p>
          <p>Each one is “correct” on its own, but they don’t tell the same story.</p>
          <p>That’s why reporting takes longer than it should and still doesn’t feel fully reliable.</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-[#0d0b09] mb-2">
            Where to start
          </h3>
          <ul className="space-y-2 text-[#2a1f1c]">
            <li>• Decide what the business actually cares about</li>
            <li>• Choose one definition for key numbers</li>
            <li>• Align your tools to that definition</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-[#c9bcad] bg-white p-6">
          <h3 className="text-lg font-semibold text-[#0d0b09] mb-3">
            Send me a copy + next steps
          </h3>

          <form action={formAction} method="GET" className="space-y-4">

            <input type="hidden" name="problem_area" value={primary} />
            <input type="hidden" name="secondary_issue" value={secondary ?? ""} />

            <input
              type="text"
              name="first_name"
              placeholder="Name"
              required
              className="w-full border border-[#c9bcad] rounded-lg px-4 py-3"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="w-full border border-[#c9bcad] rounded-lg px-4 py-3"
            />

            <button
              type="submit"
              className="w-full rounded-full px-6 py-3 text-sm font-medium"
              style={{ backgroundColor: "#2a1f1c", color: "#eedac4" }}
              onClick={() =>
                trackEvent("audit_cta_clicked", {
                  problem_area: primary,
                  secondary_issue: secondary ?? "none"
                })
              }
            >
              Send me my breakdown
            </button>
          </form>

          <p className="text-xs text-[#62493c] mt-3">
            You’ll receive a copy of your result and a short follow-up. No noise. Just clarity.
          </p>
        </div>

        <Link href="/quiz" className="text-sm text-[#62493c]">
          Retake check
        </Link>

      </div>
    </main>
  );
}