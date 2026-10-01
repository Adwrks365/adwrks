import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import {
  FOLLOW_SOCIAL,
  FOOTER_BRAND,
  FOOTER_LEGAL_LINKS,
  FOOTER_LOCATION_LINKS,
  FOOTER_NAV_LINKS,
  FOOTER_SERVICE_LINKS,
  SITE,
} from "@/lib/site";

function FooterIcon({ children }: { children: ReactNode }) {
  return (
    <svg className="footer-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {children}
    </svg>
  );
}

function PhoneIcon() {
  return (
    <FooterIcon>
      <path
        d="M6.5 4.5h2.2l1.2 3-1.6 1a12 12 0 0 0 5.2 5.2l1-1.6 3 1.2v2.2c0 .8-.7 1.5-1.5 1.5C9.2 16.9 5.1 12.8 5 6c0-.8.7-1.5 1.5-1.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </FooterIcon>
  );
}

function MailIcon() {
  return (
    <FooterIcon>
      <rect x="4" y="6" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="m5 8 7 5 7-5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </FooterIcon>
  );
}

function WhatsAppIcon() {
  return (
    <FooterIcon>
      <path
        d="M6.5 17.5 5 20l2.6-1.2A8 8 0 1 0 6.5 17.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M9 10.2c.2 1.6 1.8 3.2 3.4 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </FooterIcon>
  );
}

function PinIcon() {
  return (
    <FooterIcon>
      <path
        d="M12 20s6-5.2 6-9.2A6 6 0 0 0 6 10.8C6 14.8 12 20 12 20Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10.5" r="1.7" stroke="currentColor" strokeWidth="1.6" />
    </FooterIcon>
  );
}

function ClockIcon() {
  return (
    <FooterIcon>
      <circle cx="12" cy="12" r="7.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 8.5V12l2.5 1.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </FooterIcon>
  );
}

function SocialIcon({ label }: { label: string }) {
  if (label === "Facebook") {
    return (
      <FooterIcon>
        <path
          d="M14 8h2V5h-2c-2.2 0-4 1.8-4 4v2H8v3h2v6h3v-6h2.2l.8-3H13V9c0-.6.4-1 1-1Z"
          fill="currentColor"
        />
      </FooterIcon>
    );
  }
  if (label === "Instagram") {
    return (
      <FooterIcon>
        <rect x="5" y="5" width="14" height="14" rx="4" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="16.2" cy="7.8" r="0.8" fill="currentColor" />
      </FooterIcon>
    );
  }
  return (
    <FooterIcon>
      <rect x="4" y="7" width="16" height="11" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="m11 10.2 4 2.3-4 2.3v-4.6Z" fill="currentColor" />
    </FooterIcon>
  );
}

function LocationIcon({ label }: { label: string }) {
  if (label === "Waze") {
    return (
      <FooterIcon>
        <path
          d="M7 15.5c-1.8-1.2-2.5-3.2-1.8-5.2C6.2 7.4 8.8 5.5 12 5.5s5.8 1.9 6.8 4.8c.7 2 .1 4-1.8 5.2"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path d="M9 14.5h6l1.5 3h-9l1.5-3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </FooterIcon>
    );
  }
  if (label === "ניווט") {
    return (
      <FooterIcon>
        <path d="m5 19 14-7-7 14-1.2-6.2L5 19Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </FooterIcon>
    );
  }
  return (
    <FooterIcon>
      <path d="M5 8.5 12 5l7 3.5v8L12 20l-7-3.5v-8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
    </FooterIcon>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer site-footer-premium">
      <div className="site-footer-glow" aria-hidden="true" />
      <Container className="site-footer-main">
        <div className="site-footer-grid">
          <div className="site-footer-brand site-footer-span">
            <div className="site-footer-brand-top">
              <Link href="/" className="site-footer-logo-link" aria-label={SITE.name}>
                <Image
                  src={SITE.logoFull}
                  alt=""
                  width={156}
                  height={52}
                  loading="lazy"
                  className="site-footer-logo brightness-0 invert"
                />
              </Link>
              <h2 className="site-footer-brand-title">
                <Link href="/">{FOOTER_BRAND.heading}</Link>
              </h2>
            </div>
            <div className="site-footer-desc">
              {FOOTER_BRAND.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="site-footer-col site-footer-nav-col">
            <h2 className="site-footer-heading">ניווט</h2>
            <ul className="site-footer-links">
              {FOOTER_NAV_LINKS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="site-footer-col site-footer-services-col">
            <h2 className="site-footer-heading">שירותים</h2>
            <ul className="site-footer-links">
              {FOOTER_SERVICE_LINKS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="site-footer-col site-footer-contact-col">
            <h2 className="site-footer-heading">יצירת קשר</h2>
            <ul className="site-footer-contact">
              <li>
                <a href={SITE.phoneTel}>
                  <PhoneIcon />
                  <span>{SITE.phoneDisplay}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE.email}`}>
                  <MailIcon />
                  <span>{SITE.email}</span>
                </a>
              </li>
              <li>
                <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon />
                  <span>WhatsApp</span>
                </a>
              </li>
              <li>
                <span className="site-footer-contact-static">
                  <PinIcon />
                  <span>
                    {SITE.address.street}, {SITE.address.locality}
                  </span>
                </span>
              </li>
              <li>
                <span className="site-footer-contact-static">
                  <ClockIcon />
                  <span>
                    א&apos;-ה&apos;: <bdi>09:00–17:00</bdi>
                    {" · "}
                    שישי–שבת: סגור
                  </span>
                </span>
              </li>
            </ul>
            <nav className="site-footer-locations" aria-label="ניווט למיקום">
              {FOOTER_LOCATION_LINKS.map((item) => (
                <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer">
                  <LocationIcon label={item.label} />
                  <span>{item.label}</span>
                </a>
              ))}
            </nav>
          </div>

          <div className="site-footer-col site-footer-social-col">
            <h2 className="site-footer-heading">עקבו אחרינו</h2>
            <ul className="site-footer-social">
              {FOLLOW_SOCIAL.map((item) => (
                <li key={item.href}>
                  <a href={item.href} target="_blank" rel="noopener noreferrer">
                    <SocialIcon label={item.label} />
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
            <a
              href={SITE.googlePartnerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="site-footer-partner"
              aria-label="Google Partner"
            >
              <Image
                src={SITE.googlePartnerBadge}
                alt=""
                width={286}
                height={286}
                loading="lazy"
                className="site-footer-partner-img"
              />
            </a>
          </div>
        </div>
      </Container>

      <div className="site-footer-legal">
        <Container className="site-footer-legal-inner">
          <nav aria-label="קישורים משפטיים">
            {FOOTER_LEGAL_LINKS.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
          <p className="site-footer-copyright">
            <span className="site-footer-copyright-ltr" dir="ltr">
              © {year}
            </span>{" "}
            כל הזכויות שמורות ל־<bdi>{SITE.name}</bdi>
          </p>
        </Container>
      </div>
    </footer>
  );
}
