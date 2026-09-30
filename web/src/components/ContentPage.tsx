import dynamic from "next/dynamic";
import { HtmlContent } from "@/components/HtmlContent";
import { AboutPage } from "@/components/pages/AboutPage";
import { ContactPage } from "@/components/pages/ContactPage";
import { VerifiedServicePage } from "@/components/pages/VerifiedServicePage";
import { PricingCalculatorIframe } from "@/components/PricingCalculatorIframe";
import { ArticleTemplate } from "@/components/article/ArticleTemplate";
import { Container } from "@/components/ui/Container";
import { getExtractedPage } from "@/lib/content/elementor-extract";
import { getVerifiedServicePage } from "@/lib/pages/services";
import type { ContentItem } from "@/lib/content/types";

const ContactForm = dynamic(
  () => import("@/components/ContactForm").then((m) => m.ContactForm),
  { loading: () => <p className="text-sm text-slate-500">טוען טופס...</p> },
);

const PRICING_CALCULATOR_SRC =
  "https://a2f55361-9e5b-4902-aac9-a41086cfeb54-krtyyh.sticklight.app/pricing-calculator";

type ContentPageProps = {
  content: ContentItem;
};

export function ContentPage({ content }: ContentPageProps) {
  const verifiedService = getVerifiedServicePage(content.path);
  if (verifiedService) {
    return <VerifiedServicePage content={verifiedService} />;
  }

  if (content.path === "/about-us/") {
    const extracted = getExtractedPage(content.path);
    if (extracted) return <AboutPage data={extracted} />;
  }
  if (content.path === "/contact-us/") {
    const extracted = getExtractedPage(content.path);
    if (extracted) return <ContactPage data={extracted} />;
  }

  const isContact = content.path === "/contact-us/";
  const isHome = content.path === "/";
  const isPricing =
    content.path === "/מחירון-שיווק-דיגיטלי/" ||
    content.slug.includes("מחירון") ||
    content.title.includes("מחירון");

  let html = content.content;
  if (isPricing) {
    html = html.replace(
      /<iframe[^>]*id="pricing-calculator-iframe"[^>]*><\/iframe>/i,
      "<!--pricing-calculator-placeholder-->",
    );
    html = html.replace(
      /<iframe[^>]*pricing-calculator[^>]*><\/iframe>/i,
      "<!--pricing-calculator-placeholder-->",
    );
  }

  if (isHome) {
    return (
      <article className="content-page-shell">
        <HtmlContent html={html} />
      </article>
    );
  }

  if (content.type === "post") {
    return <ArticleTemplate content={content} />;
  }

  return (
    <article className="content-page-shell">
      <Container className="content-page-wide py-6 md:py-10">
        <div className="content-page-wide content-html-elementor">
          <HtmlContent html={html} className="content-html--page" />
        </div>

        {isPricing && (
          <div className="mt-8">
            <PricingCalculatorIframe
              src={PRICING_CALCULATOR_SRC}
              title="מחשבון מחירי שיווק דיגיטלי"
            />
          </div>
        )}

        {isContact && (
          <section className="mx-auto mt-10 max-w-xl">
            <h2 className="mb-4 text-xl font-bold text-slate-900">טופס יצירת קשר</h2>
            <ContactForm />
          </section>
        )}
      </Container>
    </article>
  );
}
