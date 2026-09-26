"use client";

import {
  ArrowRight,
  Bot,
  BookOpenCheck,
  Clock3,
  CornerDownLeft,
  Route,
  UserRound,
} from "lucide-react";
import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { useDemo } from "@/state/demo-provider";

const prompts = [
  "Why is Deadlocks prioritized?",
  "Can I finish this in 4 hours instead?",
  "What happens if I skip Synchronization?",
  "Explain Round Robin simply.",
];

export function AskScreen() {
  const { compressBudget, budgetCompressed, isUpdating } = useDemo();
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!value.trim()) return;
    if (/3\s*hours?/i.test(value)) await compressBudget();
    setSubmitted(true);
  };
  return (
    <div className="ask-layout">
      <div className="page-heading ask-heading">
        <span className="eyebrow">Ask in context</span>
        <h1>Change the plan, or inspect it.</h1>
        <p>
          Answers stay connected to your course sources and show when they
          affect the route.
        </p>
      </div>
      <section className="conversation-card">
        <div className="message system-message">
          <span className="message-avatar">
            <Route size={18} />
          </span>
          <div>
            <span>BackOnTrack</span>
            <p>
              I can explain a recommendation, simplify a concept, or update your
              available study time.
            </p>
            <div className="prompt-chips">
              {prompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => setValue(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>
        {submitted || budgetCompressed ? (
          <>
            <div className="message user-message">
              <span className="message-avatar">
                <UserRound size={17} />
              </span>
              <div>
                <span>You</span>
                <p>{value || "I only have 3 hours now."}</p>
              </div>
            </div>
            <div className="message system-message">
              <span className="message-avatar">
                <Bot size={18} />
              </span>
              <div>
                <span>BackOnTrack</span>
                {budgetCompressed ? (
                  <>
                    <h2>Study budget changed: 6h → 3h</h2>
                    <p>
                      I&apos;ve protected the highest-value concepts and your
                      final retrieval check. Lower-value review was removed
                      instead of being squeezed into unrealistic blocks.
                    </p>
                    <div className="structured-intent">
                      <span>
                        <Clock3 size={15} /> Parsed plan input
                      </span>
                      <code>timeBudgetHours: 3</code>
                    </div>
                    <div className="answer-evidence">
                      <span>
                        <BookOpenCheck size={15} /> Plan effect
                      </span>
                      <p>Deadlocks is now the next 35-minute block.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <h2>That question is ready for the learning service.</h2>
                    <p>
                      This frontend keeps conversational content behind the
                      typed API boundary. The 3-hour request is wired for the
                      deterministic demo.
                    </p>
                  </>
                )}
              </div>
            </div>
          </>
        ) : null}
        <form className="ask-composer" onSubmit={submit}>
          <label htmlFor="ask-input" className="sr-only">
            Ask about your plan
          </label>
          <textarea
            id="ask-input"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Try “I only have 3 hours now.”"
            rows={2}
          />
          <Button
            type="submit"
            size="icon"
            aria-label="Send message"
            disabled={isUpdating}
          >
            <CornerDownLeft size={18} />
          </Button>
        </form>
        <p className="composer-note">
          Try the demo:{" "}
          <button
            type="button"
            onClick={() => setValue("I only have 3 hours now.")}
          >
            I only have 3 hours now.
          </button>
        </p>
      </section>
      {budgetCompressed ? (
        <a href="/student/plan" className="ask-plan-link">
          Review the recalculated route <ArrowRight size={17} />
        </a>
      ) : null}
    </div>
  );
}
