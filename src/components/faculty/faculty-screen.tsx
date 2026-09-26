import Link from "next/link";
import { ArrowLeft, Lightbulb, LockKeyhole, UsersRound } from "lucide-react";

const gaps = [
  { topic: "Synchronization", value: 61 },
  { topic: "Deadlocks", value: 48 },
  { topic: "CPU Scheduling", value: 31 },
  { topic: "Memory Management", value: 18 },
];

export function FacultyScreen() {
  return (
    <>
      <Link href="/student" className="back-link">
        <ArrowLeft size={16} /> Return to student view
      </Link>
      <div className="page-heading faculty-heading">
        <div>
          <span className="eyebrow">Faculty view · Aggregated</span>
          <h1>Operating Systems · Cohort gaps</h1>
          <p>
            A brief intervention view for the teaching team, without individual
            student ranking.
          </p>
        </div>
        <div className="cohort-mark">
          <UsersRound size={20} />
          <span>
            <strong>84 students</strong>
            <small>Current cohort</small>
          </span>
        </div>
      </div>
      <div className="faculty-grid">
        <section className="cohort-gaps-card">
          <div className="section-heading-row">
            <div>
              <span className="eyebrow">Below mastery threshold</span>
              <h2>Topics needing attention</h2>
            </div>
            <span className="threshold-label">Threshold · 60%</span>
          </div>
          <div className="gap-bars">
            {gaps.map((gap) => (
              <div className="gap-row" key={gap.topic}>
                <span>{gap.topic}</span>
                <div>
                  <i style={{ width: `${gap.value}%` }} />
                </div>
                <strong className="mono">{gap.value}%</strong>
              </div>
            ))}
          </div>
        </section>
        <section className="intervention-card">
          <span className="intervention-icon">
            <Lightbulb size={21} />
          </span>
          <span className="eyebrow">Suggested intervention</span>
          <h2>Synchronization fundamentals</h2>
          <p>Most common dependency gap across the current cohort.</p>
          <div className="intervention-plan">
            <span>Potential intervention</span>
            <strong>20-minute recap before Thursday tutorial</strong>
          </div>
          <p className="suggested-note">
            Suggested from aggregate patterns. Faculty decides what fits the
            class.
          </p>
        </section>
      </div>
      <div className="privacy-note">
        <LockKeyhole size={17} />
        <span>
          <strong>Privacy by default</strong>Aggregated cohort view — no
          individual student ranking.
        </span>
      </div>
    </>
  );
}
