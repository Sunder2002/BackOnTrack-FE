"use client";

import { ArrowRight, Clock3, Info, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlanChangePanel } from "./plan-change-panel";
import { RecoveryRoute } from "./recovery-route";
import { useDemo } from "@/state/demo-provider";

export function PlanScreen() {
  const { plan, topics, lastChange, student, startFocus } = useDemo();
  return (
    <>
      <div className="page-heading split-heading">
        <div>
          <span className="eyebrow">Live learning route</span>
          <h1>Your plan</h1>
          <p>
            Ordered by assessment relevance, prerequisite value and your latest
            mastery.
          </p>
        </div>
        <Button onClick={startFocus}>
          Start next block <ArrowRight size={17} />
        </Button>
      </div>
      <div className="plan-summary-strip">
        <div>
          <span>Study budget</span>
          <strong className="mono">{student.studyBudgetHours}h</strong>
        </div>
        <div>
          <span>Current readiness</span>
          <strong className="mono">{plan.readiness}%</strong>
        </div>
        <div>
          <span>Target readiness</span>
          <strong className="mono">{plan.targetReadiness}%</strong>
        </div>
        <div>
          <span>Route logic</span>
          <strong>Adaptive</strong>
        </div>
      </div>
      {lastChange ? (
        <PlanChangePanel change={lastChange} />
      ) : (
        <section className="plan-principle">
          <Route size={20} />
          <div>
            <strong>The route is ready.</strong>
            <p>
              Complete a mastery check or change your available time to see it
              recalculate.
            </p>
          </div>
        </section>
      )}
      <section className="plan-detail-card">
        <div className="section-heading-row">
          <div>
            <span className="eyebrow">From now to exam</span>
            <h2>Recovery route</h2>
          </div>
          <span className="plan-total">
            <Clock3 size={16} /> {student.studyBudgetHours} hours protected
          </span>
        </div>
        <RecoveryRoute plan={plan} topics={topics} />
      </section>
      <p className="method-note">
        <Info size={15} /> Readiness is a mastery estimate, not a predicted exam
        score. The plan keeps previous state available if an update fails.
      </p>
    </>
  );
}
