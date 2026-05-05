"use client";

import Link from "next/link";
import Script from "next/script";
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

const categoryLabels: Record<ResultKey, string> = {
  reporting: "Reporting & Visibility",
  data_flow: "Tools & Data Flow",
  alignment: "Strategic Alignment",
  process: "Process & Handover",
  structure: "Operational Structure",
  strong_system: "Strong System",
  system_wide: "System-Wide Strain"
};

const FEA_FORM_BASE_URL =
  "https://link.feacreate.com/widget/form/eJY81SJhHlOz4GnQP7du";

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

      const allStrong = averages.every((item) => item.average >= 4.5);
      const systemWide = averages.filter((item) => item.average < 3).length >= 3;

      let finalPrimary: ResultKey | null = null;
      let finalSecondary: Category | null = null;
      let resultType = "category_result";

      if (allStrong) {
        finalPrimary = "strong_system";
        finalSecondary = null;
        resultType = "strong_system";
      } else if (systemWide) {
        finalPrimary = "system_wide";
        finalSecondary = null;
        resultType = "system_wide";
      } else {
        finalPrimary = averages[0]?.category ?? null;
        finalSecondary = averages[1]?.category ?? null;
      }

      setPrimary(finalPrimary);
      setSecondary(finalSecondary);

      if (
        typeof window !== "undefined" &&
        typeof window.gtag === "function" &&
        !window.auditResultFired &&
        finalPrimary
      ) {
        window.gtag("event", "audit_result_viewed", {
          problem_area: finalPrimary,
          secondary_issue: finalSecondary ?? "none",
          result_type: resultType,
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

  const feaFormUrl = useMemo(() => {
    if (!primary) return FEA_FORM_BASE_URL;

    const params = new URLSearchParams({
      problem_area: primary,
      secondary_issue: secondary ?? ""
    });

    return `${FEA_FORM_BASE_URL}?${params.toString()}`;
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
      <Script
        src="https://link.feacreate.com/js/form_embed.js"
        strategy="afterInteractive"
      />

      <div className="mx-auto max-w-2xl space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold text-[#0d0b09] mb-4">
            Here’s what’s making your marketing feel harder than it should
          </h1>

          <p className="text-[#2a1f1c] mb-6">
            Based on your answers, one part of your setup is creating most of the friction.
          </p>

          <h2 className="text-xl font-semibold text-[#0d0b09] mb-2">
            Your main friction point: {categoryLabels[primary]}
          </h2>

          <p className="text-[#2a1f1c]">
            Your setup is working in places. But it’s not designed to connect.
          </p>
        </div>

        <div className="space-y-4 text-[#2a1f1c]">
          <p>You’re likely pulling numbers from multiple tools.</p>
          <p>Each one is “correct” on its own, but they don’t tell the same story.</p>
          <p>
            That’s why reporting takes longer than it should and still doesn’t feel fully reliable.
          </p>
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
            See what to do next
          </h3>

          <p className="text-sm text-[#2a1f1c] mb-4">
            Enter your details to get the next step based on your main friction point.
          </p>

          <iframe
            src={feaFormUrl}
            style={{ width: "100%", height: "452px", border: "none", borderRadius: "0px" }}
            id="inline-eJY81SJhHlOz4GnQP7du"
            data-layout='{"id":"INLINE"}'
            data-trigger-type="alwaysShow"
            data-trigger-value=""
            data-activation-type="alwaysActivated"
            data-activation-value=""
            data-deactivation-type="neverDeactivate"
            data-deactivation-value=""
            data-form-name="The Infrastructure Audit - April 2026"
            data-height="452"
            data-layout-iframe-id="inline-eJY81SJhHlOz4GnQP7du"
            data-form-id="eJY81SJhHlOz4GnQP7du"
            title="The Infrastructure Audit - April 2026"
          />

          <p className="text-xs text-[#62493c] mt-3">
            You’ll receive a short follow-up focused on your result. No noise. Just clarity.
          </p>
        </div>

        <Link href="/quiz" className="text-sm text-[#62493c]">
          Retake check
        </Link>
      </div>
    </main>
  );
}