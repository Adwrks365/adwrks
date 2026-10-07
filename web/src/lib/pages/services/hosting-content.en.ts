export * from "./hosting-content";

export const HOSTING_PATH = "/en/hosting-plans/" as const;

export const HOSTING_HERO = {
  badge: "Managed hosting",
  title: "Website Hosting & Maintenance Plans",
  lead: "Secure, managed WordPress hosting with maintenance, updates, and support — so your site stays fast and available.",
};

export const HOSTING_GUIDE_PATHS = [
  "/en/hosting-maintenance-guide/",
  "/en/wordpress-hosting-maintenance/",
] as const;

export const HOSTING_RELATED_SERVICES = [
  { href: "/en/website-building/", title: "Website Building", text: "New sites with hosting included." },
] as const;
