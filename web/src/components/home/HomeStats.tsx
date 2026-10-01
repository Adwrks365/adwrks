import { StatCounters } from "@/components/home/StatCounters";
import { Container } from "@/components/ui/Container";
import { HOMEPAGE_COUNTERS } from "@/lib/homepage/data";

export function HomeStats() {
  return (
    <section className="home-stats" aria-label="נתוני אמון">
      <Container>
        <div className="reveal">
          <StatCounters items={HOMEPAGE_COUNTERS} />
        </div>
      </Container>
    </section>
  );
}
