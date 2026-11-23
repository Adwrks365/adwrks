export type VisibilityCostEstimate = {
  organicDepth: number;
  maxQueries: number;
  estimatedUsdMin: number;
  estimatedUsdMax: number;
  /** Extra API charge when async AI overview load is enabled (~$0.002 per query typical). */
  asyncAiLoadExtraUsdPerQuery: number;
  includesAiSourceCheck: boolean;
  provider: string;
  summaryHe: string;
  summaryEn: string;
};

export function visibilityCostEstimate(): VisibilityCostEstimate {
  return {
    organicDepth: 20,
    maxQueries: 3,
    estimatedUsdMin: 0.03,
    estimatedUsdMax: 0.1,
    asyncAiLoadExtraUsdPerQuery: 0.002,
    includesAiSourceCheck: true,
    provider: "DataForSEO",
    summaryHe:
      "אומדן לדוח חי (3 ביטויים): כ־$0.03–0.10 · עומק אורגני: 20 תוצאות · מקורות סקירת AI נבדקים כשהסקירה מוצגת (כולל טעינת AI אסינכרונית בתוספת ~$0.002 לביטוי)",
    summaryEn:
      "Live report estimate (3 phrases): ~$0.03–0.10 · organic depth: 20 results · AI overview sources checked when shown (async AI load ~$0.002 extra per phrase)",
  };
}