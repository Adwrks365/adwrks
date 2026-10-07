import Link from "next/link";
import { Container } from "@/components/ui/Container";
import type { LocaleProps } from "@/lib/locale-props";

/** Preserved SEO authority block — copy and internal links unchanged per locale. */
export function HomeSeoAuthority({ locale = "he" }: LocaleProps) {
  if (locale === "en") {
    return (
      <section className="home-seo-authority" aria-labelledby="home-seo-heading">
        <Container narrow>
          <header className="home-section-header reveal">
            <p className="home-section-label">Adwrks 365 — Since 2018</p>
            <h2 id="home-seo-heading" className="home-section-title">
              Digital marketing with results
            </h2>
          </header>
          <div className="home-seo-authority-body reveal">
            <p>
              Since 2018, <strong>Adwrks 365</strong> has provided a comprehensive{" "}
              <Link href="/en/digital-marketing-for-business/" className="home-seo-link">
                digital marketing
              </Link>{" "}
              suite combining technology with personal, hands-on guidance. We specialize in tailored
              strategy including website building, organic SEO, and{" "}
              <Link href="/en/google-ads/" className="home-seo-link">
                ROI-focused paid campaigns
              </Link>
              .
            </p>
            <p>
              Our team proudly serves <strong>businesses across Israel</strong> — from large companies
              and organizations to small businesses and professionals in every field — adapting digital
              solutions to each client&apos;s business goals. We provide a broad marketing suite including
              effective websites and landing pages,{" "}
              <Link href="/en/seo/" className="home-seo-link">
                <strong>organic SEO</strong>
              </Link>
              ,{" "}
              <Link href="/en/google-ads/" className="home-seo-link">
                <strong>paid search (PPC/SEM)</strong>
              </Link>{" "}
              on Google and social networks, and Google Maps promotion. Alongside our expertise in
              Russian-market marketing, we offer content and creative in{" "}
              <strong>Hebrew, Russian, and English</strong> — turning every marketing budget into a
              profitable growth engine with full transparency nationwide.
            </p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="home-seo-authority" aria-labelledby="home-seo-heading">
      <Container narrow>
        <header className="home-section-header reveal">
          <p className="home-section-label">Adwrks 365 - מאז 2018</p>
          <h2 id="home-seo-heading" className="home-section-title">
            שיווק דיגיטלי עם תוצאות
          </h2>
        </header>
        <div className="home-seo-authority-body reveal">
          <p>
            מאז שנת 2018, אנחנו בחברת <strong>Adwrks 365</strong> מעניקים מעטפת{" "}
            <Link href="/שיווק-דיגיטלי-לעסקים/" className="home-seo-link">
              שיווק דיגיטלי
            </Link>{" "}
            מקיפה המשלבת חדשנות טכנולוגית עם ליווי אישי וצמוד. אנו מתמחים בבניית אסטרטגיה
            מותאמת אישית הכוללת בניית אתרים, קידום אורגני (SEO) ו
            <Link href="/google-ads/" className="home-seo-link">
              {" "}
              ניהול קמפיינים ממומנים
            </Link>{" "}
            ממוקדי ROI.
          </p>
          <p>
            הצוות שלנו גאה להעניק שירות מקצועי <strong>לעסקים בכל רחבי הארץ</strong> – מחברות
            וארגונים גדולים ועד לעסקים קטנים ובעלי מקצוע בכל תחום – תוך התאמת הפתרונות
            הדיגיטליים למטרות העסקיות של כל לקוח. אנו מספקים מעטפת שיווקית רחבה הכוללת בניית
            אתרים ודפי נחיתה אפקטיביים,{" "}
            <Link href="/seo/" className="home-seo-link">
              <strong>קידום אורגני (SEO)</strong>
            </Link>
            ,{" "}
            <Link href="/google-ads/" className="home-seo-link">
              <strong>ניהול קמפיינים ממומנים (PPC/SEM)</strong>
            </Link>{" "}
            בגוגל וברשתות החברתיות, וקידום ממוקד בגוגל מפות. לצד התמחותנו הייחודית בשיווק
            למגזר הרוסי, אנו מציעים שירותי תוכן וקריאייטיב בשפות{" "}
            <strong>עברית, רוסית ואנגלית</strong>, במטרה להפוך כל תקציב שיווק למנוע צמיחה
            רווחי – בשקיפות מלאה ובכל נקודה על המפה.
          </p>
        </div>
      </Container>
    </section>
  );
}
