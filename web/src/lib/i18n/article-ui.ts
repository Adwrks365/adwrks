import type { Locale } from "@/i18n/routing";

const HE = {
  asideLabel: "מידע נלווה למאמר",
  backToBlog: "חזרה לכל המאמרים",
  tocSummary: "תוכן עניינים",
  tocNav: "תוכן עניינים",
  moreArticles: "מאמרים נוספים",
  readArticle: "קראו את המאמר",
  facebookReviews: "המלצות מ-Facebook",
  viewAllFacebook: "צפו בכל ההמלצות ב-Facebook",
  clientQuotes: "מה הלקוחות אומרים",
  sidebarContactTitle: "רוצים שנעזור לכם לקדם את העסק?",
  sidebarContactNote: "השאירו פרטים ונחזור אליכם בהקדם.",
  name: "שם *",
  phone: "טלפון *",
  email: "אימייל",
  submit: "שליחה",
  submitting: "שולח...",
  sidebarMessage: "פנייה מטופס צד מאמר",
  relatedHeading: "מאמרים שעשויים לעניין אתכם",
  ctaText: "רוצים ליישם את מה שלמדתם במאמר?",
  ctaButton: "דברו איתנו",
  aboutAuthor: "אודות הכותב",
  contactAuthor: "צרו קשר",
  articleTag: "מאמר",
  readFull: "למאמר המלא",
  endSection: "סיום המאמר",
  adjacentNav: "ניווט בין מאמרים",
  prevArticle: "המאמר הקודם",
  nextArticle: "המאמר הבא",
  rateTitle: "דרגו את המאמר",
  rateAria: "דרגו את המאמר",
  rateStar: (n: number) => `דירוג ${n} מתוך 5`,
  rateThanks: "תודה על הדירוג!",
  rateAlready: "כבר דירגתם מאמר זה.",
  rateLoading: "טוען דירוג…",
  rateSummary: (avg: string, count: string) => `דירוג ${avg} מתוך 5 · ${count} דירוגים`,
  rateEmpty: "עדיין אין דירוגים למאמר זה",
  rateLoadError: "לא ניתן לטעון את הדירוג.",
  rateSaveError: "לא ניתן לשמור את הדירוג.",
  formSuccess: "ההודעה נשלחה בהצלחה.",
  formError: "לא ניתן לשלוח את הטופס כרגע. נסו שוב מאוחר יותר.",
  blogHref: "/blog/",
  contactHref: "/contact-us/",
} as const;

const EN = {
  asideLabel: "Article sidebar",
  backToBlog: "Back to all articles",
  tocSummary: "Table of contents",
  tocNav: "Table of contents",
  moreArticles: "More articles",
  readArticle: "Read article",
  facebookReviews: "Facebook reviews",
  viewAllFacebook: "View all reviews on Facebook",
  clientQuotes: "What clients say",
  sidebarContactTitle: "Want help growing your business?",
  sidebarContactNote: "Leave your details and we'll get back to you soon.",
  name: "Name *",
  phone: "Phone *",
  email: "Email",
  submit: "Submit",
  submitting: "Sending...",
  sidebarMessage: "Article sidebar inquiry",
  relatedHeading: "Related articles",
  ctaText: "Ready to apply what you learned?",
  ctaButton: "Talk to us",
  aboutAuthor: "About the author",
  contactAuthor: "Contact us",
  articleTag: "Article",
  readFull: "Read full article",
  endSection: "End of article",
  adjacentNav: "Article navigation",
  prevArticle: "Previous article",
  nextArticle: "Next article",
  rateTitle: "Rate this article",
  rateAria: "Rate this article",
  rateStar: (n: number) => `Rating ${n} out of 5`,
  rateThanks: "Thanks for your rating!",
  rateAlready: "You already rated this article.",
  rateLoading: "Loading rating…",
  rateSummary: (avg: string, count: string) => `Rating ${avg} out of 5 · ${count} ratings`,
  rateEmpty: "No ratings for this article yet",
  rateLoadError: "Could not load rating.",
  rateSaveError: "Could not save rating.",
  formSuccess: "Your message was sent successfully.",
  formError: "Could not submit the form. Please try again later.",
  blogHref: "/en/blog/",
  contactHref: "/en/contact-us/",
} as const;

export type ArticleUi = {
  asideLabel: string;
  backToBlog: string;
  tocSummary: string;
  tocNav: string;
  moreArticles: string;
  readArticle: string;
  facebookReviews: string;
  viewAllFacebook: string;
  clientQuotes: string;
  sidebarContactTitle: string;
  sidebarContactNote: string;
  name: string;
  phone: string;
  email: string;
  submit: string;
  submitting: string;
  sidebarMessage: string;
  relatedHeading: string;
  ctaText: string;
  ctaButton: string;
  aboutAuthor: string;
  contactAuthor: string;
  articleTag: string;
  readFull: string;
  endSection: string;
  adjacentNav: string;
  prevArticle: string;
  nextArticle: string;
  rateTitle: string;
  rateAria: string;
  rateStar: (n: number) => string;
  rateThanks: string;
  rateAlready: string;
  rateLoading: string;
  rateSummary: (avg: string, count: string) => string;
  rateEmpty: string;
  rateLoadError: string;
  rateSaveError: string;
  formSuccess: string;
  formError: string;
  blogHref: string;
  contactHref: string;
};

export function getArticleUi(locale: Locale): ArticleUi {
  return locale === "en" ? EN : HE;
}
