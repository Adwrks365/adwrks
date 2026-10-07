import { StatCounters } from "@/components/home/StatCounters";
import { Container } from "@/components/ui/Container";
import { getHomepageData } from "@/lib/homepage";
import type { LocaleProps } from "@/lib/locale-props";

export function HomeStats({ locale = "he" }: LocaleProps) {
  const { HOMEPAGE_COUNTERS } = getHomepageData(locale);
  return (
    <section className="home-stats" aria-label="נתוני אמון">
      <Container>
        <StatCounters items={HOMEPAGE_COUNTERS} />
      </Container>
    </section>
  );
}
