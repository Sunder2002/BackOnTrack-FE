"use client";

import Link from "next/link";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  ArrowRight,
  BookOpenCheck,
  ChevronRight,
  Clock3,
  Compass,
  Layers3,
  TrendingUp,
  X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { demoCourse, demoEvidence, demoSources } from "@/data/demo/riya";
import { RecoveryRoute } from "@/components/plan/recovery-route";
import { useDemo } from "@/state/demo-provider";

export function OverviewScreen() {
  const { student, plan, topics, startFocus, lastChange } = useDemo();
  const [whyOpen, setWhyOpen] = useState(false);
  const nextBlock =
    plan.blocks.find((block) => block.id === plan.nextBlockId) ??
    plan.blocks[0];
  const nextTopic = topics.find((topic) => topic.id === nextBlock.topicId);
  const strongTopics = topics.filter((topic) =>
    plan.deprioritizedTopicIds.includes(topic.id),
  );

  return (
    <>
      <div className="page-heading overview-heading">
        <div>
          <span className="eyebrow">
            Recovery mission · {demoCourse.examCountdown}
          </span>
          <h1>Let&apos;s get you back on track.</h1>
          <p>
            You have {student.studyBudgetHours} hours before Operating Systems.
            We&apos;ve prioritized what matters most using your mastery, course
            dependencies and exam scope.
          </p>
        </div>
        <div
          className="readiness-mark"
          aria-label={`${plan.readiness}% current readiness`}
          style={{
            background: `conic-gradient(var(--brand) 0 ${plan.readiness}%, var(--brand-soft) ${plan.readiness}% 100%)`,
          }}
        >
          <span className="mono">{plan.readiness}%</span>
          <small>Readiness</small>
        </div>
      </div>

      <section className="metric-strip" aria-label="Recovery context">
        <div>
          <Clock3 aria-hidden="true" />
          <span>Time available</span>
          <strong className="mono">{student.studyBudgetHours}h</strong>
        </div>
        <div>
          <Layers3 aria-hidden="true" />
          <span>Missed</span>
          <strong>{student.missedPeriod}</strong>
        </div>
        <div>
          <TrendingUp aria-hidden="true" />
          <span>Current readiness</span>
          <strong className="mono">{plan.readiness}%</strong>
        </div>
        <div>
          <Compass aria-hidden="true" />
          <span>Target readiness</span>
          <strong className="mono">{plan.targetReadiness}%</strong>
        </div>
      </section>

      {lastChange ? (
        <Link href="/student/plan" className="update-banner">
          <span className="update-icon">
            <TrendingUp size={18} />
          </span>
          <span>
            <strong>{lastChange.title}</strong>
            <small>{lastChange.summary}</small>
          </span>
          <span className="update-link">
            See what changed <ChevronRight size={16} />
          </span>
        </Link>
      ) : null}

      <div className="overview-grid">
        <div className="overview-primary">
          <section className="next-card">
            <div className="next-card-topline">
              <span className="eyebrow">Next best block</span>
              <span className="decision-note">Chosen from 6 topics</span>
            </div>
            <div className="next-title-row">
              <div>
                <h2>{nextBlock.title}</h2>
                <p>{nextBlock.rationale}</p>
              </div>
              <div className="duration-badge">
                <strong className="mono">{nextBlock.minutes}</strong>
                <span>min</span>
              </div>
            </div>
            <div className="reason-chips">
              <span>High assessment relevance</span>
              {nextTopic ? (
                <span>Current mastery {nextTopic.mastery}%</span>
              ) : null}
              <span>
                {nextBlock.id === "deadlocks"
                  ? "Highest remaining gap"
                  : "Unlocks Synchronization"}
              </span>
            </div>
            <div className="next-actions">
              <Button onClick={startFocus}>
                Start {nextBlock.minutes}-minute block <ArrowRight size={17} />
              </Button>
              <Button variant="secondary" onClick={() => setWhyOpen(true)}>
                Why this?
              </Button>
              <span className="shortcut-hint">
                <kbd>S</kbd> to start
              </span>
            </div>
          </section>

          <section className="route-card">
            <div className="section-heading-row">
              <div>
                <span className="eyebrow">Adaptive sequence</span>
                <h2>Your recovery route</h2>
              </div>
              <Link href="/student/plan">
                Open plan <ChevronRight size={16} />
              </Link>
            </div>
            <RecoveryRoute plan={plan} topics={topics} />
          </section>
        </div>

        <div className="overview-secondary">
          <section className="deprioritized-card">
            <div className="section-icon">
              <BookOpenCheck aria-hidden="true" size={19} />
            </div>
            <span className="eyebrow">Time protected</span>
            <h2>Already strong — deprioritized</h2>
            <p>Useful, but not where your next hour belongs.</p>
            <div className="strong-topic-list">
              {strongTopics.map((topic) => (
                <div key={topic.id}>
                  <span>{topic.title}</span>
                  <strong className="mono">{topic.mastery}%</strong>
                </div>
              ))}
            </div>
          </section>
          <blockquote className="coach-quote">
            “
            {nextBlock.id === "deadlocks"
              ? "Deadlocks belong in the syllabus. Not in your study plan."
              : "CPU Scheduling first. Even your syllabus believes in priorities."}
            ”
          </blockquote>
        </div>
      </div>

      <DialogPrimitive.Root open={whyOpen} onOpenChange={setWhyOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-[rgba(23,32,31,.3)]" />
          <DialogPrimitive.Content className="why-drawer">
            <div className="drawer-header">
              <div>
                <span className="eyebrow">Recommendation evidence</span>
                <DialogPrimitive.Title>
                  {demoEvidence.title}
                </DialogPrimitive.Title>
              </div>
              <DialogPrimitive.Close
                className="icon-button"
                aria-label="Close recommendation evidence"
              >
                <X size={19} />
              </DialogPrimitive.Close>
            </div>
            <DialogPrimitive.Description className="drawer-intro">
              The route uses curriculum requirements and your current state. You
              can inspect every reason.
            </DialogPrimitive.Description>
            <ol className="evidence-list">
              {demoEvidence.reasons.map((reason, index) => (
                <li key={reason.id}>
                  <span>{index + 1}</span>
                  <p>{reason.statement}</p>
                </li>
              ))}
            </ol>
            <div className="drawer-sources">
              <span className="eyebrow">Sources used</span>
              {demoSources
                .filter((source) => demoEvidence.sourceIds.includes(source.id))
                .map((source) => (
                  <div key={source.id}>
                    <BookOpenCheck size={16} />
                    <span>{source.title}</span>
                    <small>
                      {source.id === "diagnostic"
                        ? "3/7 correct"
                        : source.detail}
                    </small>
                  </div>
                ))}
            </div>
            <div className="drawer-actions">
              <Button
                onClick={() => {
                  setWhyOpen(false);
                  startFocus();
                }}
              >
                Start this block <ArrowRight size={17} />
              </Button>
              <DialogPrimitive.Close asChild>
                <Button variant="ghost">Keep reviewing plan</Button>
              </DialogPrimitive.Close>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  );
}
