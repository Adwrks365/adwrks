import dynamic from "next/dynamic";
import { ContextualPopupRegistrar } from "@/components/popups/ContextualPopupRegistrar";
import { HtmlContent } from "@/components/HtmlContent";
import { AboutPage } from "@/components/pages/AboutPage";
import { ContactPage } from "@/components/pages/ContactPage";
import { VerifiedServicePage } from "@/components/pages/VerifiedServicePage";
import { GoogleAdsServicePage } from "@/components/services/GoogleAdsServicePage";
import { HostingPlansServicePage } from "@/components/services/HostingPlansServicePage";
import { SeoServicePage } from "@/components/services/SeoServicePage";
import { ServiceHubPage } from "@/components/services/ServiceHubPage";
import { SocialMediaServicePage } from "@/components/services/SocialMediaServicePage";
import { WebsiteBuildingServicePage } from "@/components/services/WebsiteBuildingServicePage";
import { CheckFitPage } from "@/components/pages/CheckFitPage";
import { PricingPage } from "@/components/pages/PricingPage";
import { ArticleTemplate } from "@/components/article/ArticleTemplate";
import { Container } from "@/components/ui/Container";
import type { Locale } from "@/i18n/routing";
import { getExtractedPage } from "@/lib/content/elementor-extract";
import { heComposerPath } from "@/lib/i18n/composer-path";
import { getVerifiedServicePage } from "@/lib/pages/services";
import { getServicePopupConfig, isServicePopupPath } from "@/lib/popups/service-pages";
import type { ContentItem } from "@/lib/content/types";

const ContactForm = dynamic(
  () => import("@/components/ContactForm").then((m) => m.ContactForm),
  { loading: () => <p className="text-sm text-slate-500">…</p> },
);

type ContentPageProps = {
  content: ContentItem;
  locale: Locale;
};

export function ContentPage({ content, locale }: ContentPageProps) {
  const composerPath = heComposerPath(content.path, locale);

  if (composerPath === "/website-building/") {
    return <WebsiteBuildingServicePage locale={locale} />;
  }
  if (composerPath === "/שירותי-שיווק-דיגיטלי/") {
    return <ServiceHubPage locale={locale} />;
  }
  if (composerPath === "/seo/") {
    return <SeoServicePage locale={locale} />;
  }
  if (composerPath === "/google-ads/") {
    return <GoogleAdsServicePage locale={locale} />;
  }
  if (composerPath === "/social-media-management/") {
    return <SocialMediaServicePage locale={locale} />;
  }
  if (composerPath === "/hosting-plans/") {
    return <HostingPlansServicePage locale={locale} />;
  }
  if (composerPath === "/מחירון-שיווק-דיגיטלי/") {
    return <PricingPage locale={locale} />;
  }

  const verifiedService = getVerifiedServicePage(composerPath);
  if (verifiedService) {
    return <VerifiedServicePage content={verifiedService} />;
  }

  if (composerPath === "/check-fit/") {
    return <CheckFitPage locale={locale} />;
  }

  if (composerPath === "/about-us/") {
    return <AboutPage locale={locale} />;
  }
  if (composerPath === "/contact-us/") {
    const extracted = getExtractedPage(composerPath);
    if (extracted) return <ContactPage data={extracted} locale={locale} />;
  }

  const isContact = composerPath === "/contact-us/";
  const isHome = composerPath === "/";

  const html = content.content;

  if (isHome) {
    return (
      <article className="content-page-shell">
        <HtmlContent html={html} locale={locale} />
      </article>
    );
  }

  if (content.type === "post") {
    return <ArticleTemplate content={content} locale={locale} />;
  }

  const legacyServicePopup =
    isServicePopupPath(composerPath) && !getVerifiedServicePage(composerPath)
      ? getServicePopupConfig(composerPath, content.title)
      : null;

  const contactPath = locale === "en" ? "/en/contact-us/" : "/contact-us/";

  return (
    <article className="content-page-shell">
      <Container className="content-page-wide py-6 md:py-10">
        <div className="content-page-wide content-html-elementor">
          <HtmlContent html={html} className="content-html--page" locale={locale} />
        </div>

        {isContact && (
          <section className="mx-auto mt-10 max-w-xl">
            <h2 className="mb-4 text-xl font-bold text-slate-900">
              {locale === "en" ? "Contact form" : "טופס יצירת קשר"}
            </h2>
            <ContactForm
              formId="contact-page"
              pageTitle={locale === "en" ? "Contact" : "צור קשר"}
              pagePath={contactPath}
              locale={locale}
            />
          </section>
        )}
      </Container>

      {legacyServicePopup && <ContextualPopupRegistrar config={legacyServicePopup} />}
    </article>
  );
}
