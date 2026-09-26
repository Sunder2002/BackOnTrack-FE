import {
  budgetPlanChange,
  compressedPlan,
  defaultPlan,
  demoCourse,
  demoEvidence,
  demoNudges,
  demoSources,
  demoStudent,
  demoTopics,
  masteryPlanChange,
  reroutedPlan,
} from "@/data/demo/riya";
import type { LearningApi } from "./types";

const delay = <T>(value: T, ms = 80) =>
  new Promise<T>((resolve) =>
    setTimeout(() => resolve(structuredClone(value)), ms),
  );

export const mockLearningApi: LearningApi = {
  getStudentProfile: () => delay(demoStudent),
  getCourseContext: () => delay(demoCourse),
  getTopics: () => delay(demoTopics),
  getRecoveryPlan: () => delay(defaultPlan),
  getCoachNudges: () => delay(demoNudges),
  getSources: () => delay(demoSources),
  getRecommendationEvidence: () => delay(demoEvidence),
  submitMasteryCheck: async (topicId) => {
    if (topicId !== "cpu-scheduling") {
      throw new Error(
        "The demo mastery check is configured for CPU Scheduling.",
      );
    }
    return delay({
      topicId,
      before: 38,
      after: 72,
      plan: reroutedPlan,
      change: masteryPlanChange,
    });
  },
  updateTimeBudget: async (hours) => {
    if (hours !== 3) {
      throw new Error(
        "The deterministic demo supports the 3-hour recovery route.",
      );
    }
    return delay({
      previousHours: 6,
      currentHours: hours,
      plan: compressedPlan,
      change: budgetPlanChange,
    });
  },
};
