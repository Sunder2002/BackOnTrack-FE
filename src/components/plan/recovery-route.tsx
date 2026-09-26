"use client";

import { Check, LockKeyhole } from "lucide-react";
import { cn, formatMinutes } from "@/lib/utils";
import type { RecoveryPlan, Topic } from "@/services/api/types";

export function RecoveryRoute({
  plan,
  topics,
  compact = false,
}: {
  plan: RecoveryPlan;
  topics: Topic[];
  compact?: boolean;
}) {
  return (
    <ol
      className={cn("route-list", compact && "route-list-compact")}
      aria-label="Recovery route"
    >
      {plan.blocks.map((block, index) => {
        const topic = topics.find((item) => item.id === block.topicId);
        return (
          <li
            className={cn("route-item", `route-${block.status}`)}
            key={block.id}
          >
            <div className="route-track" aria-hidden="true">
              <span className="route-node">
                {block.status === "complete" ? (
                  <Check size={15} strokeWidth={2.5} />
                ) : (
                  index + 1
                )}
              </span>
              {index < plan.blocks.length - 1 ? (
                <span className="route-line" />
              ) : null}
            </div>
            <div className="route-content">
              <div className="route-title-row">
                <div>
                  <h3>{block.title}</h3>
                  {block.status === "current" ? (
                    <span className="route-status">Next</span>
                  ) : null}
                  {block.status === "complete" ? (
                    <span className="route-status complete">Complete</span>
                  ) : null}
                </div>
                <span className="route-time mono">
                  {block.minutes === 0 ? "Done" : formatMinutes(block.minutes)}
                </span>
              </div>
              {!compact ? (
                <div className="route-meta">
                  {topic ? (
                    <span>{topic.mastery}% mastery</span>
                  ) : (
                    <span>{block.rationale}</span>
                  )}
                  {block.status === "locked" ? (
                    <span className="locked-label">
                      <LockKeyhole size={13} /> Depends on {block.lockedBy}
                    </span>
                  ) : null}
                </div>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
