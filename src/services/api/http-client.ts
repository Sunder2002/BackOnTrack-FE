import type {
  BudgetUpdateResult,
  Course,
  LearningApi,
  MasteryCheckResult,
  Nudge,
  RecommendationEvidence,
  RecoveryPlan,
  SourceReference,
  StudentProfile,
  Topic,
} from "./types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const url = `${BASE_URL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(
      `API request failed: ${response.status} ${response.statusText} (${errorText || endpoint})`,
    );
  }

  return response.json() as Promise<T>;
}

export const httpLearningApi: LearningApi = {
  getStudentProfile: () => apiFetch<StudentProfile>("student/profile"),
  getCourseContext: () => apiFetch<Course>("course/context"),
  getTopics: () => apiFetch<Topic[]>("topics"),
  getRecoveryPlan: () => apiFetch<RecoveryPlan>("plan/recovery"),
  getCoachNudges: () => apiFetch<Nudge[]>("coach/nudges"),
  getSources: () => apiFetch<SourceReference[]>("sources"),
  getRecommendationEvidence: (topicId: string) =>
    apiFetch<RecommendationEvidence>(
      `topics/${encodeURIComponent(topicId)}/evidence`,
    ),
  submitMasteryCheck: (topicId: string) =>
    apiFetch<MasteryCheckResult>(
      `topics/${encodeURIComponent(topicId)}/mastery-check`,
      {
        method: "POST",
      },
    ),
  updateTimeBudget: (hours: number) =>
    apiFetch<BudgetUpdateResult>("plan/budget", {
      method: "POST",
      body: JSON.stringify({ hours }),
    }),
};
