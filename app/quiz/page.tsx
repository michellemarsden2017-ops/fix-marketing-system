"use client";

import { useState } from "react";

type Answer = {
  label: string;
  score: number;
};

type Category =
  | "reporting"
  | "data_flow"
  | "alignment"
  | "process"
  | "structure";

type Question = {
  question: string;
  category: Category;
  answers: Answer[];
};

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

const questions: Question[] = [
  // Reporting & Visibility
  {
    category: "reporting",
    question: "How do you usually pull together a marketing performance update?",
    answers: [
      { label: "Everything is already in one place and easy to explain", score: 5 },
      { label: "I pull from a few places, but it is manageable", score: 4 },
      { label: "I rebuild the report manually each time", score: 2 },
      { label: "I avoid reporting until I absolutely have to", score: 1 }
    ]
  },
  {
    category: "reporting",
    question: "How confident are you in the numbers you report?",
    answers: [
      { label: "Very confident — I trust them completely", score: 5 },
      { label: "Mostly confident, with occasional checks", score: 4 },
      { label: "I double-check before sharing", score: 2 },
      { label: "I don’t fully trust the data", score: 1 }
    ]
  },
  {
    category: "reporting",
    question: "When someone asks what’s working, what happens?",
    answers: [
      { label: "I can answer quickly with clear data", score: 5 },
      { label: "I can answer, but it takes some digging", score: 4 },
      { label: "I piece together an answer manually", score: 2 },
      { label: "I struggle to give a clear answer", score: 1 }
    ]
  },

  // Tools & Data Flow
  {
    category: "data_flow",
    question: "How well do your marketing tools connect to each other?",
    answers: [
      { label: "They are fully connected and flow cleanly", score: 5 },
      { label: "Mostly connected with a few gaps", score: 4 },
      { label: "Some manual work is needed", score: 2 },
      { label: "They are not really connected", score: 1 }
    ]
  },
  {
    category: "data_flow",
    question: "How often do you have to fix or check data manually?",
    answers: [
      { label: "Rarely", score: 5 },
      { label: "Occasionally", score: 4 },
      { label: "Often", score: 2 },
      { label: "Constantly", score: 1 }
    ]
  },

  // Strategic Alignment
  {
    category: "alignment",
    question: "How clear are you on what marketing is expected to deliver?",
    answers: [
      { label: "Completely clear", score: 5 },
      { label: "Mostly clear", score: 4 },
      { label: "Somewhat unclear", score: 2 },
      { label: "Not clear at all", score: 1 }
    ]
  },
  {
    category: "alignment",
    question: "If leadership asks what marketing contributes, what happens?",
    answers: [
      { label: "I can clearly connect activity to outcomes", score: 5 },
      { label: "I can explain it with some effort", score: 4 },
      { label: "I give a general answer", score: 2 },
      { label: "I struggle to connect it at all", score: 1 }
    ]
  },

  // Process & Handover
  {
    category: "process",
    question: "How documented are your key marketing processes?",
    answers: [
      { label: "Fully documented and easy to follow", score: 5 },
      { label: "Partially documented", score: 4 },
      { label: "Mostly in my head", score: 2 },
      { label: "Not documented at all", score: 1 }
    ]
  },
  {
    category: "process",
    question: "If someone else had to take over your work, what would happen?",
    answers: [
      { label: "They could pick it up easily", score: 5 },
      { label: "They could manage with some guidance", score: 4 },
      { label: "It would be difficult", score: 2 },
      { label: "It would fall apart", score: 1 }
    ]
  },

  // Operational Structure
  {
    category: "structure",
    question: "How organized is your marketing setup overall?",
    answers: [
      { label: "Everything has a clear place and structure", score: 5 },
      { label: "Mostly organized", score: 4 },
      { label: "Somewhat scattered", score: 2 },
      { label: "Very scattered", score: 1 }
    ]
  },
  {
    category: "structure",
    question: "When something breaks, how easy is it to fix?",
    answers: [
      { label: "Very easy — I know exactly where to look", score: 5 },
      { label: "Manageable with some effort", score: 4 },
      { label: "Time-consuming to figure out", score: 2 },
      { label: "Very difficult to diagnose", score: 1 }
    ]
  },
  {
    category: "structure",
    question: "Which statement feels most true right now?",
    answers: [
      { label: "My system supports me", score: 5 },
      { label: "My system mostly works", score: 4 },
      { label: "My system slows me down", score: 2 },
      { label: "My system creates extra work", score: 1 }
    ]
  }
];

const sectionLabels: Record<Category, string> = {
  reporting: "Reporting & Visibility",
  data_flow: "Tools & Data Flow",
  alignment: "Strategic Alignment",
  process: "Process & Handover",
  structure: "Operational Structure"
};

export default function QuizPage() {
  const [current, setCurrent] = useState(0);
  const [scores, setScores] = useState<Record<Category, number>>({
    reporting: 0,
    data_flow: 0,
    alignment: 0,
    process: 0,
    structure: 0
  });
  const [counts, setCounts] = useState<Record<Category, number>>({
    reporting: 0,
    data_flow: 0,
    alignment: 0,
    process: 0,
    structure: 0
  });

  const handleAnswer = (category: Category, score: number) => {
    const nextScores = {
      ...scores,
      [category]: scores[category] + score
    };

    const nextCounts = {
      ...counts,
      [category]: counts[category] + 1
    };

    setScores(nextScores);
    setCounts(nextCounts);

    if (current < questions.length - 1) {
      setCurrent(current + 1);
      return;
    }

    localStorage.setItem("quiz_scores", JSON.stringify(nextScores));
    localStorage.setItem("quiz_counts", JSON.stringify(nextCounts));

    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "quiz_completed", {
        event_category: "engagement",
        event_label: "fix_marketing_system"
      });
    }

    if (typeof window !== "undefined" && typeof window.gtag === "function") {
  window.gtag("event", "quiz_completed", {
    event_category: "engagement",
    event_label: "fix_marketing_system"
  });
}

setTimeout(() => {
  window.location.href = "/results";
}, 300);
  };

  const q = questions[current];
  const progress = Math.round(((current + 1) / questions.length) * 100);

  return (
    <main className="min-h-screen bg-[#f3efef] flex items-center justify-center px-6 py-12">
      <div className="max-w-2xl w-full">
        <div className="mb-6">
          <p className="text-sm text-[#62493c] mb-2">Progress: {progress}%</p>
          <div className="w-full h-2 bg-[#c9bcad] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#c06e3a] rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-[#c9bcad] bg-white p-8 shadow-sm">
          <p className="text-xs tracking-[0.2em] uppercase text-[#62493c] mb-4">
            {sectionLabels[q.category]}
          </p>

          <h2 className="text-2xl md:text-3xl font-semibold text-[#0d0b09] mb-4 leading-tight">
            {q.question}
          </h2>

          <p className="text-sm text-[#62493c] mb-6">
            There’s no right answer here — this just reflects how your setup currently works.
          </p>

          <div className="space-y-3">
            {q.answers.map((a, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(q.category, a.score)}
                className="w-full text-left rounded-xl px-4 py-4 border border-[#c9bcad] bg-white hover:bg-[#eedac4] transition"
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}