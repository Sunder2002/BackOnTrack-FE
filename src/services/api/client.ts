import type { LearningApi } from "./types";
import { mockLearningApi } from "./mock-client";

// Swap this binding for an HTTP implementation when the backend is available.
export const learningApi: LearningApi = mockLearningApi;
