"use client";

import { ArrowRight, Info, TrendingUp } from "lucide-react";
import { useDemo } from "@/state/demo-provider";

const statusLabels = {
  strong: "Strong",
  developing: "Developing",
  "needs-work": "Needs work",
  priority: "Priority",
} as const;

export function MasteryScreen() {
  const { topics, masteryComplete } = useDemo();
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">Current state</span>
        <h1>Mastery map</h1>
        <p>
          A focused view of what&apos;s secure, what&apos;s developing and what
          needs attention next.
        </p>
      </div>
      <p className="mastery-disclaimer">
        <Info size={16} /> Mastery is an estimate based on your checks and
        assessments — not a predicted exam score.
      </p>
      <section className="mastery-list-card">
        <div className="mastery-table-header">
          <span>Topic</span>
          <span>Estimate</span>
          <span>Status</span>
        </div>
        {topics.map((topic) => (
          <div className="mastery-row" key={topic.id}>
            <div>
              <strong>{topic.title}</strong>
              <span>
                {topic.dependencies.length
                  ? `Builds on ${topic.dependencies.length} topic${topic.dependencies.length > 1 ? "s" : ""}`
                  : "Foundation"}
              </span>
            </div>
            <div className="mastery-meter">
              <span style={{ width: `${topic.mastery}%` }} />
              <strong className="mono">{topic.mastery}%</strong>
            </div>
            <span className={`mastery-status status-${topic.status}`}>
              <i aria-hidden="true" />
              {statusLabels[topic.status]}
            </span>
          </div>
        ))}
      </section>
      <section className="today-change-card">
        <div>
          <span className="eyebrow">What changed today?</span>
          <h2>
            {masteryComplete
              ? "CPU Scheduling moved above threshold"
              : "No new checks yet"}
          </h2>
          <p>
            {masteryComplete
              ? "The plan released time and redirected it to the highest-priority gap."
              : "Complete the current CPU Scheduling block to update your route."}
          </p>
        </div>
        <div className="today-shift">
          <TrendingUp size={20} />
          <span>CPU Scheduling</span>
          <strong className="mono">38%</strong>
          <ArrowRight size={17} />
          <strong className="mono">{masteryComplete ? "72%" : "—"}</strong>
        </div>
      </section>
    </>
  );
}
