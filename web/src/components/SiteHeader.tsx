"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PRIMARY_NAV, SITE, type NavItem } from "@/lib/site";

function NavChevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`ms-1 inline-block h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href);
}

function DesktopDropdown({
  item,
  open,
  onOpen,
  onClose,
  pathname,
  closeAll,
}: {
  item: NavItem;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  pathname: string;
  closeAll: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const active = isActive(pathname, item.href);

  return (
    <div
      ref={ref}
      className="site-nav-group relative"
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
      onFocus={onOpen}
      onBlur={(e) => {
        if (!ref.current?.contains(e.relatedTarget as Node)) onClose();
      }}
    >
      <Link
        href={item.href}
        className={`site-nav-link site-nav-link-dropdown ${active ? "is-active" : ""}`}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={closeAll}
      >
        {item.label}
        <NavChevron open={open} />
      </Link>
      <div className={`site-nav-dropdown ${open ? "is-open" : ""}`} role="menu">
        <Link
          href={item.href}
          className="site-nav-dropdown-parent"
          role="menuitem"
          onClick={closeAll}
        >
          {item.href === "/blog/" ? "כל המאמרים" : item.label}
        </Link>
        {item.children?.map((child) => (
          <Link
            key={child.href}
            href={child.href}
            className={`site-nav-dropdown-item ${isActive(pathname, child.href) ? "is-active" : ""}`}
            role="menuitem"
            onClick={closeAll}
          >
            {child.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function SiteHeaderNav({ pathname }: { pathname: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const closeAll = useCallback(() => {
    setOpenDropdown(null);
    setMobileOpen(false);
    setMobileExpanded(null);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAll();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeAll]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-header ${scrolled ? "site-header--scrolled" : ""}`.trim()}>
      <Container className="site-header-inner">
        <Link href="/" className="shrink-0" aria-label={`${SITE.name} – דף הבית`} onClick={closeAll}>
          <Image
            src={SITE.logo}
            alt={SITE.name}
            width={140}
            height={47}
            priority
            className="h-auto w-[130px] sm:w-[140px]"
          />
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="תפריט ראשי">
          {PRIMARY_NAV.map((item) =>
            item.children ? (
              <DesktopDropdown
                key={item.href}
                item={item}
                open={openDropdown === item.href}
                onOpen={() => setOpenDropdown(item.href)}
                onClose={() => setOpenDropdown(null)}
                pathname={pathname}
                closeAll={closeAll}
              />
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`site-nav-link ${isActive(pathname, item.href) ? "is-active" : ""}`}
                onClick={closeAll}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden lg:block">
          <Button href="/contact-us/" size="sm">
            התייעצו איתנו
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg p-2.5 text-slate-700 hover:bg-slate-100 lg:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span className="sr-only">פתח תפריט</span>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </Container>

      {mobileOpen && (
        <nav
          id="mobile-nav"
          className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden"
          aria-label="תפריט נייד"
        >
          <ul className="space-y-1">
            {PRIMARY_NAV.map((item) => (
              <li key={item.href}>
                {item.children ? (
                  <>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
                      onClick={() =>
                        setMobileExpanded(mobileExpanded === item.href ? null : item.href)
                      }
                      aria-expanded={mobileExpanded === item.href}
                    >
                      {item.label}
                      <NavChevron open={mobileExpanded === item.href} />
                    </button>
                    {mobileExpanded === item.href && (
                      <ul className="me-3 mt-1 space-y-1 border-r-2 border-sky-100 pe-3">
                        <li>
                          <Link
                            href={item.href}
                            className="block rounded-lg px-3 py-2 text-sm font-medium text-sky-700 hover:bg-sky-50"
                            onClick={closeAll}
                          >
                            {item.href === "/blog/" ? "כל המאמרים" : item.label}
                          </Link>
                        </li>
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className="block rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-sky-50"
                              onClick={closeAll}
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={`block rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-slate-50 ${
                      isActive(pathname, item.href) ? "bg-sky-50 text-sky-800" : "text-slate-800"
                    }`}
                    onClick={closeAll}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  return <SiteHeaderNav key={pathname} pathname={pathname} />;
}
