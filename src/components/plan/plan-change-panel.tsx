"use client";

import { ArrowRight, Clock3, Route } from "lucide-react";
import type { PlanChange } from "@/services/api/types";

export function PlanChangePanel({ change }: { change: PlanChange }) {
  return (
    <section className="change-panel" aria-live="polite">
      <div className="change-heading">
        <span className="change-icon">
          <Route aria-hidden="true" size={20} />
        </span>
        <div>
          <span className="eyebrow">Route recalculated</span>
          <h2>{change.title}</h2>
        </div>
        {change.releasedMinutes ? (
          <div className="time-released">
            <span>Time released</span>
            <strong className="mono">+{change.releasedMinutes} min</strong>
          </div>
        ) : null}
      </div>
      <p className="change-summary">{change.summary}</p>
      <div className="change-comparison">
        <div>
          <span>Before</span>
          <p>{change.before}</p>
        </div>
        <ArrowRight aria-hidden="true" size={18} />
        <div>
          <span>Now</span>
          <p>{change.after}</p>
        </div>
      </div>
      {change.destination ? (
        <p className="change-destination">
          <Clock3 aria-hidden="true" size={16} /> {change.destination}
        </p>
      ) : null}
    </section>
  );
}
