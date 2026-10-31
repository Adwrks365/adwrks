/** Case study slots — publish only when status is "published" and owner-approved metrics exist. */

export type CaseStudyCategory = "google-ads" | "seo" | "meta-ads" | "website-building";

export type CaseStudyRecord = {
  id: string;
  category: CaseStudyCategory;
  status: "pending_data" | "published";
  title?: string;
  summary?: string;
  metrics?: readonly { label: string; value: string }[];
};

export const CASE_STUDY_REGISTRY: readonly CaseStudyRecord[] = [
  { id: "cs-gads-01", category: "google-ads", status: "pending_data" },
  { id: "cs-seo-01", category: "seo", status: "pending_data" },
  { id: "cs-meta-01", category: "meta-ads", status: "pending_data" },
  { id: "cs-wb-01", category: "website-building", status: "pending_data" },
] as const;

export function caseStudiesForCategory(category: CaseStudyCategory): CaseStudyRecord[] {
  return CASE_STUDY_REGISTRY.filter((c) => c.category === category);
}
