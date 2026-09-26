export type TopicStatus = "strong" | "developing" | "needs-work" | "priority";
export type BlockStatus = "complete" | "current" | "queued" | "locked";

export interface StudentProfile {
  id: string;
  name: string;
  initials: string;
  missedPeriod: string;
  motivationAnchor: string;
  studyBudgetHours: number;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  examLabel: string;
  examCountdown: string;
  targetReadiness: number;
}

export interface Topic {
  id: string;
  title: string;
  mastery: number;
  status: TopicStatus;
  assessmentRelevance: "high" | "medium" | "low";
  dependencies: string[];
}

export interface StudyBlock {
  id: string;
  topicId: string;
  title: string;
  minutes: number;
  status: BlockStatus;
  rationale: string;
  lockedBy?: string;
}

export interface RecoveryPlan {
  id: string;
  readiness: number;
  targetReadiness: number;
  totalMinutes: number;
  nextBlockId: string;
  blocks: StudyBlock[];
  deprioritizedTopicIds: string[];
}

export interface PlanChange {
  id: string;
  reason: "mastery" | "time-budget";
  title: string;
  summary: string;
  releasedMinutes?: number;
  before: string;
  after: string;
  destination?: string;
}

export interface Nudge {
  id: string;
  priority: "now" | "heads-up" | "motivation";
  eyebrow: string;
  title: string;
  body: string;
  action?: string;
}

export interface SourceReference {
  id: string;
  title: string;
  type: "syllabus" | "lecture" | "outcome" | "rubric" | "diagnostic";
  updatedAt: string;
  status: "approved-demo-source";
  topicsMapped: number;
  detail: string;
}

export interface EvidenceItem {
  id: string;
  statement: string;
}

export interface RecommendationEvidence {
  topicId: string;
  title: string;
  reasons: EvidenceItem[];
  sourceIds: string[];
  estimatedMinutes: number;
}

export interface MasteryCheckResult {
  topicId: string;
  before: number;
  after: number;
  plan: RecoveryPlan;
  change: PlanChange;
}

export interface BudgetUpdateResult {
  previousHours: number;
  currentHours: number;
  plan: RecoveryPlan;
  change: PlanChange;
}

export interface LearningApi {
  getStudentProfile(): Promise<StudentProfile>;
  getCourseContext(): Promise<Course>;
  getTopics(): Promise<Topic[]>;
  getRecoveryPlan(): Promise<RecoveryPlan>;
  getCoachNudges(): Promise<Nudge[]>;
  getSources(): Promise<SourceReference[]>;
  getRecommendationEvidence(topicId: string): Promise<RecommendationEvidence>;
  submitMasteryCheck(topicId: string): Promise<MasteryCheckResult>;
  updateTimeBudget(hours: number): Promise<BudgetUpdateResult>;
}
