import { asset } from "@/lib/site";

/** Verified Google Partner badge from migrated media library. */
export const GOOGLE_PARTNER_BADGE = {
  src: asset("Partner-CMYK-.webp"),
  alt: "Google Partner",
  width: 286,
  height: 286,
} as const;

/** Clean Meta Business Partner badge (owner-provided asset). */
export const META_PARTNER_BADGE = {
  src: asset("Meta-Badge.webp"),
  alt: "Meta Business Partner",
  width: 775,
  height: 444,
} as const;
