import type { HubCopy, LocationCopy, ServiceBlock } from "./types";

export const SHARED_WORK_EN: Pick<
  LocationCopy,
  "workLabel" | "workTitle" | "workIntro" | "workSteps"
> = {
  workLabel: "How we work",
  workTitle: "Remote digital marketing — clear process, measurable results",
  workIntro:
    "We work fully online with businesses across Israel — no need for a physical visit: discovery, strategy, campaigns, SEO, content, and landing pages. High availability on WhatsApp, phone, and video; transparent reports and real-time measurement of cost per lead, lead quality, sales, and ROI.",
  workSteps: [
    {
      title: "Discovery and business goals",
      text: "We define what success looks like: lead volume, customer type, budget, and channels. We audit your site, profiles, and campaigns and find gaps.",
    },
    {
      title: "Strategy and action plan",
      text: "We choose channels (Google Ads, Meta, SEO, landing pages) for your audience and competition. Messaging, campaign structure, and measurement hierarchy.",
    },
    {
      title: "Launch, measure, optimize",
      text: "Campaigns go live, data is tracked in real time, and ads, pages, and keywords improve continuously. High availability for questions and changes.",
    },
    {
      title: "Scale what works",
      text: "We double down on winners, cut waste, and expand channels when the unit economics support it.",
    },
  ],
};

export const SHARED_SERVICE_BLOCKS_EN: ServiceBlock[] = [
  {
    title: "Google Ads (PPC)",
    text: "Search, Performance Max, and YouTube with geo targeting, keywords, and landing pages built to convert — focused on leads and sales, not clicks alone.",
  },
  {
    title: "Meta — Facebook & Instagram",
    text: "Audience, interest, and location targeting. Creative, A/B tests, and conversion tracking for fast reach and brand growth.",
  },
  {
    title: "SEO",
    text: "Content, site structure, speed, and authority for long-term visibility — including alignment with AI-assisted search.",
  },
  {
    title: "Landing pages & websites",
    text: "Fast, clear pages optimized for conversion — or full sites when you need a long-term digital asset.",
  },
  {
    title: "Strategy, reporting & ROI",
    text: "Cross-channel planning, KPIs, clear reports, and ongoing recommendations. You know spend, return, and next steps.",
  },
];

export const FAQ_BUDGET_ROI_EN = [
  {
    q: "What is the minimum budget for digital marketing?",
    a: "There is no one number for everyone. It depends on industry, competition, and goals. In the discovery call we outline what makes sense for Google and Meta, and when SEO should come first. Full transparency before commitment.",
  },
  {
    q: "How do you measure ROI?",
    a: "We agree upfront on cost per lead, cost per sale, and deal value. Forms, calls, CRM, and eCommerce tie back to campaigns. Monthly reports show what works and what to change.",
  },
  {
    q: "Is everything done remotely?",
    a: "Yes. Strategy, execution, reporting, and calls are online nationwide. Video meetings when needed — no dependency on a physical visit.",
  },
] as const;

export const HUB_WORK_EN: Pick<HubCopy, "workLabel" | "workTitle" | "workIntro" | "workSteps"> =
  SHARED_WORK_EN;
