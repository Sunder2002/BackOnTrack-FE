import {
  BookCopy,
  BookOpenCheck,
  CheckCircle2,
  ClipboardCheck,
  FileChartColumn,
  ListChecks,
} from "lucide-react";
import { demoSources } from "@/data/demo/riya";

const iconMap = {
  syllabus: BookCopy,
  lecture: BookOpenCheck,
  outcome: ListChecks,
  rubric: ClipboardCheck,
  diagnostic: FileChartColumn,
};

export function SourcesScreen() {
  return (
    <>
      <div className="page-heading sources-heading">
        <div>
          <span className="eyebrow">Grounding</span>
          <h1>Course sources</h1>
          <p>
            The route is constrained by approved curriculum inputs. The model
            does not invent the course.
          </p>
        </div>
        <div className="source-health">
          <CheckCircle2 size={18} />
          <span>
            <strong>7 of 7 connected</strong>
            <small>Demo dataset current</small>
          </span>
        </div>
      </div>
      <section className="source-list" aria-label="Course sources">
        <div className="source-list-header">
          <span>Source</span>
          <span>Last updated</span>
          <span>Status</span>
          <span>Coverage</span>
        </div>
        {demoSources.map((source) => {
          const Icon = iconMap[source.type];
          return (
            <article key={source.id} className="source-row">
              <div className="source-name">
                <span className="source-icon">
                  <Icon size={18} />
                </span>
                <span>
                  <strong>{source.title}</strong>
                  <small>{source.detail}</small>
                </span>
              </div>
              <span>{source.updatedAt}</span>
              <span className="verified-label">
                <CheckCircle2 size={15} /> Approved source
              </span>
              <span>
                <strong className="mono">{source.topicsMapped}</strong> topics
                mapped
              </span>
            </article>
          );
        })}
      </section>
      <p className="source-footnote">
        “Approved source” means approved for this demo dataset. It is not an
        external certification.
      </p>
    </>
  );
}
