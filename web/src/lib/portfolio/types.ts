export type PortfolioProjectTag = "web-system" | "local-business" | "professional-services";

export type PortfolioProject = {
  id: string;
  title: string;
  screenshot: string;
  screenshotAlt: string;
  /** Display width in px (for next/image layout stability). */
  screenshotWidth: number;
  /** Display height in px (for next/image layout stability). */
  screenshotHeight: number;
  featured: boolean;
  legacy: boolean;
  sortOrder: number;
  tags?: readonly PortfolioProjectTag[];
  /** Reserved for future in-article portfolio blocks (Phase 5H+). */
  articlePaths?: readonly string[];
  /** Optional second line under title (e.g. project type). */
  captionSubtitle?: string;
  /** When false, hide public caption (alt text still used). */
  showCaption?: boolean;
  /** Owner should confirm title/tags when true. */
  needsConfirmation?: boolean;
};

export type PortfolioShowcaseVariant = "compact" | "rich" | "inline";
