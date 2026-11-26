import { SiteCheckTool } from "@/components/tools/SiteCheckTool";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ServiceFaq } from "@/components/services/shared/ServiceFaq";
import type { SiteCheckView } from "@/lib/pages/site-check/registry";
import { SITE } from "@/lib/site";

type SiteCheckPageProps = {
  view: SiteCheckView;
};

export function SiteCheckPage({ view }: SiteCheckPageProps) {
  const { copy, locale } = view;

  return (
    <article className="sp-page structured-page site-check-page">
      <section className="site-check-hero-band" aria-label={copy.title}>
        <div className="site-check-hero-bg" aria-hidden="true" />
        <Container className="site-check-container">
          <SiteCheckTool
            locale={locale}
            copy={copy}
            phoneTel={SITE.phoneTel}
            phoneDisplay={SITE.phoneDisplay}
            defaultTitle={copy.title}
            seoTitle={copy.seoFocusTitle}
          />
        </Container>
      </section>

      <Section tone="white" title={copy.faqTitle} align="start" narrow className="site-check-faq-section">
        <ServiceFaq items={copy.faq} className="site-check-faq" />
      </Section>
    </article>
  );
}