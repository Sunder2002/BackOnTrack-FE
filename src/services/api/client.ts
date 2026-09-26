import type { LearningApi } from "./types";
import { mockLearningApi } from "./mock-client";
import { httpLearningApi } from "./http-client";

// Toggle between mock and real HTTP backend via NEXT_PUBLIC_DEMO_MODE in .env
const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

export const learningApi: LearningApi = isDemoMode
  ? mockLearningApi
  : httpLearningApi;
