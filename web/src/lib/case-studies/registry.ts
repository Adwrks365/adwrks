import { CASE_STUDIES } from "./cases";
import type { CaseStudyCategory, CaseStudyRecord } from "./types";

export type { CaseStudyCategory, CaseStudyRecord } from "./types";

export function getPublishedCaseStudies(category: CaseStudyCategory): CaseStudyRecord[] {
  return CASE_STUDIES.filter((c) => c.status === "published" && c.categories.includes(category));
}

/** @deprecated use getPublishedCaseStudies */
export function caseStudiesForCategory(category: CaseStudyCategory): CaseStudyRecord[] {
  return getPublishedCaseStudies(category);
}
