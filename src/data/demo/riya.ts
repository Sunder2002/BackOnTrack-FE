import type {
  Course,
  Nudge,
  PlanChange,
  RecommendationEvidence,
  RecoveryPlan,
  SourceReference,
  StudentProfile,
  Topic,
} from "@/services/api/types";

export const demoStudent: StudentProfile = {
  id: "riya",
  name: "Riya",
  initials: "RS",
  missedPeriod: "Weeks 4–6",
  motivationAnchor: "Systems internship goal",
  studyBudgetHours: 6,
};

export const demoCourse: Course = {
  id: "os-301",
  code: "CS 301",
  title: "Operating Systems",
  examLabel: "Friday · 11:00 AM",
  examCountdown: "3d 4h until exam",
  targetReadiness: 70,
};

export const demoTopics: Topic[] = [
  {
    id: "process-basics",
    title: "Process basics",
    mastery: 81,
    status: "strong",
    assessmentRelevance: "medium",
    dependencies: [],
  },
  {
    id: "system-calls",
    title: "System calls",
    mastery: 78,
    status: "strong",
    assessmentRelevance: "medium",
    dependencies: ["process-basics"],
  },
  {
    id: "cpu-scheduling",
    title: "CPU Scheduling",
    mastery: 38,
    status: "needs-work",
    assessmentRelevance: "high",
    dependencies: ["process-basics"],
  },
  {
    id: "synchronization",
    title: "Process Synchronization",
    mastery: 42,
    status: "needs-work",
    assessmentRelevance: "high",
    dependencies: ["cpu-scheduling"],
  },
  {
    id: "deadlocks",
    title: "Deadlocks",
    mastery: 31,
    status: "priority",
    assessmentRelevance: "high",
    dependencies: ["synchronization"],
  },
  {
    id: "memory-management",
    title: "Memory Management",
    mastery: 58,
    status: "developing",
    assessmentRelevance: "high",
    dependencies: ["process-basics"],
  },
];

export const defaultPlan: RecoveryPlan = {
  id: "riya-os-default",
  readiness: 46,
  targetReadiness: 70,
  totalMinutes: 360,
  nextBlockId: "cpu-scheduling",
  blocks: [
    {
      id: "cpu-scheduling",
      topicId: "cpu-scheduling",
      title: "CPU Scheduling",
      minutes: 35,
      status: "current",
      rationale: "High exam relevance and unlocks concurrency topics.",
    },
    {
      id: "synchronization",
      topicId: "synchronization",
      title: "Process Synchronization",
      minutes: 50,
      status: "locked",
      lockedBy: "CPU Scheduling",
      rationale: "A dependency for Deadlocks and a current mastery gap.",
    },
    {
      id: "deadlocks",
      topicId: "deadlocks",
      title: "Deadlocks",
      minutes: 55,
      status: "queued",
      rationale: "Lowest mastery among high-relevance exam topics.",
    },
    {
      id: "memory-management",
      topicId: "memory-management",
      title: "Memory Management",
      minutes: 45,
      status: "queued",
      rationale: "Developing mastery with high assessment relevance.",
    },
    {
      id: "targeted-review",
      topicId: "review",
      title: "Targeted review",
      minutes: 40,
      status: "queued",
      rationale: "Revisit only the errors surfaced by practice.",
    },
    {
      id: "retrieval-check",
      topicId: "retrieval",
      title: "Final retrieval check",
      minutes: 30,
      status: "queued",
      rationale:
        "Verify recall before the exam, without relearning everything.",
    },
  ],
  deprioritizedTopicIds: ["process-basics", "system-calls"],
};

export const reroutedPlan: RecoveryPlan = {
  ...defaultPlan,
  id: "riya-os-rerouted",
  readiness: 54,
  nextBlockId: "deadlocks",
  blocks: defaultPlan.blocks.map((block) => {
    if (block.id === "cpu-scheduling") {
      return { ...block, minutes: 0, status: "complete" as const };
    }
    if (block.id === "synchronization") {
      return { ...block, status: "queued" as const };
    }
    if (block.id === "deadlocks") {
      return { ...block, minutes: 73, status: "current" as const };
    }
    return block;
  }),
};

export const compressedPlan: RecoveryPlan = {
  ...reroutedPlan,
  id: "riya-os-compressed",
  totalMinutes: 180,
  nextBlockId: "deadlocks",
  blocks: [
    {
      ...reroutedPlan.blocks.find((block) => block.id === "cpu-scheduling")!,
    },
    {
      id: "deadlocks",
      topicId: "deadlocks",
      title: "Deadlocks",
      minutes: 35,
      status: "current",
      rationale: "Highest remaining gap inside the reduced study budget.",
    },
    {
      id: "synchronization",
      topicId: "synchronization",
      title: "Synchronization essentials",
      minutes: 35,
      status: "queued",
      rationale: "Compressed to the concepts that directly support exam tasks.",
    },
    {
      id: "memory-management",
      topicId: "memory-management",
      title: "Memory Management",
      minutes: 30,
      status: "queued",
      rationale: "Targeted practice on the most assessed subtopics.",
    },
    {
      id: "retrieval-check",
      topicId: "retrieval",
      title: "Final retrieval check",
      minutes: 25,
      status: "queued",
      rationale: "Protect recall time despite the tighter budget.",
    },
  ],
};

export const masteryPlanChange: PlanChange = {
  id: "mastery-cpu-72",
  reason: "mastery",
  title: "Plan updated",
  summary:
    "You reached the required mastery sooner than expected. 18 minutes have been reassigned to Deadlocks.",
  releasedMinutes: 18,
  before: "CPU Scheduling · 38% mastery · 50 min remaining",
  after: "CPU Scheduling · 72% mastery · Complete",
  destination:
    "Deadlocks now receives 73 minutes because it remains the highest-priority gap.",
};

export const budgetPlanChange: PlanChange = {
  id: "budget-3h",
  reason: "time-budget",
  title: "Study budget changed",
  summary:
    "Your route now protects the highest-value concepts and one final retrieval check.",
  before: "6 hours · 5 learning blocks",
  after: "3 hours · 3 focused blocks + final check",
  destination:
    "Lower-value review was removed, not squeezed into unrealistic blocks.",
};

export const demoEvidence: RecommendationEvidence = {
  topicId: "cpu-scheduling",
  title: "Why CPU Scheduling first?",
  estimatedMinutes: 35,
  reasons: [
    {
      id: "gap",
      statement: "Your diagnostic indicates a gap here — 38% mastery.",
    },
    { id: "scope", statement: "It is part of the current exam scope." },
    {
      id: "dependency",
      statement:
        "Understanding scheduling helps with later concurrency concepts.",
    },
    { id: "time", statement: "Estimated recovery time: 35 minutes." },
  ],
  sourceIds: ["syllabus", "week-4", "diagnostic"],
};

export const demoNudges: Nudge[] = [
  {
    id: "now",
    priority: "now",
    eyebrow: "Now",
    title: "35 min · CPU Scheduling",
    body: "Start here. It unlocks two later topics.",
    action: "Start",
  },
  {
    id: "exam",
    priority: "heads-up",
    eyebrow: "Heads-up",
    title: "Exam Friday · 11:00 AM",
    body: "You still have enough time to complete today's route.",
  },
  {
    id: "anchor",
    priority: "motivation",
    eyebrow: "Why this matters",
    title: "Systems internship goal",
    body: "Today's concurrency topics also strengthen your systems foundation.",
  },
];

export const demoSources: SourceReference[] = [
  {
    id: "syllabus",
    title: "Operating Systems syllabus",
    type: "syllabus",
    updatedAt: "Sep 18",
    status: "approved-demo-source",
    topicsMapped: 12,
    detail: "Exam scope, week sequence and topic dependencies.",
  },
  {
    id: "week-4",
    title: "Week 4 lecture notes",
    type: "lecture",
    updatedAt: "Sep 19",
    status: "approved-demo-source",
    topicsMapped: 3,
    detail: "CPU Scheduling, algorithms and turnaround-time problems.",
  },
  {
    id: "week-5",
    title: "Week 5 lecture notes",
    type: "lecture",
    updatedAt: "Sep 21",
    status: "approved-demo-source",
    topicsMapped: 3,
    detail: "Synchronization primitives and critical-section reasoning.",
  },
  {
    id: "week-6",
    title: "Week 6 lecture notes",
    type: "lecture",
    updatedAt: "Sep 23",
    status: "approved-demo-source",
    topicsMapped: 2,
    detail: "Deadlock conditions, avoidance and detection.",
  },
  {
    id: "outcomes",
    title: "Learning outcomes",
    type: "outcome",
    updatedAt: "Sep 18",
    status: "approved-demo-source",
    topicsMapped: 8,
    detail: "Expected explanation, comparison and problem-solving outcomes.",
  },
  {
    id: "rubric",
    title: "Assessment rubric",
    type: "rubric",
    updatedAt: "Sep 20",
    status: "approved-demo-source",
    topicsMapped: 6,
    detail: "Assessment weight and required depth by outcome.",
  },
  {
    id: "diagnostic",
    title: "Previous diagnostic",
    type: "diagnostic",
    updatedAt: "Today",
    status: "approved-demo-source",
    topicsMapped: 6,
    detail: "Riya's most recent topic-level checks and error patterns.",
  },
];
