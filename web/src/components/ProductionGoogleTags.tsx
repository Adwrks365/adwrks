import { headers } from "next/headers";
import { GoogleTags } from "@/components/GoogleTags";
import { shouldAllowIndexing } from "@/lib/indexing";

export async function ProductionGoogleTags() {
  const host = (await headers()).get("host");
  if (!shouldAllowIndexing(host)) return null;
  return <GoogleTags />;
}
