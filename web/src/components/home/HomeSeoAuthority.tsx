import Link from "next/link";
import { Container } from "@/components/ui/Container";

/** Preserved SEO authority block — copy and internal links unchanged. */
export function HomeSeoAuthority() {
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
