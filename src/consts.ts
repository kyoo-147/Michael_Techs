import type { Locale } from "@/i18n/config";

export interface SiteConfig {
  website: string;
  author: string;
  profile: string;
  title: string;
  description: string;
  desc: string;
  ogImage: string;
  lightAndDarkMode: boolean;
  postPerIndex: number;
  postPerPage: number;
  scheduledPostMargin: number;
  showArchives: boolean;
  showBackButton: boolean;
  dynamicOgImage: boolean;
  defaultLocale: Locale;
  editPost: {
    enabled: boolean;
    text: string;
    url: string;
  };
}

export const SITE: SiteConfig = {
  website: "https://michaeltechs.xyz/",
  author: "Michael",
  profile: "https://michaeltechs.xyz/about",
  title: "Michael",
  description:
    "Builder, engineer, and writer building practical AI systems, products, and software.",
  desc: "Builder, engineer, and writer building practical AI systems, products, and software.",
  ogImage: "og-default.png",
  lightAndDarkMode: false,
  postPerIndex: 4,
  postPerPage: 12,
  scheduledPostMargin: 15 * 60 * 1000,
  showArchives: true,
  showBackButton: false,
  dynamicOgImage: false,
  defaultLocale: "en",
  editPost: {
    enabled: false,
    text: "Edit on GitHub",
    url: "https://github.com/kyoo-147/michael-portfolio/edit/main/",
  },
};

export const SITE_TITLE = SITE.title;
export const SITE_DESCRIPTION = SITE.description;

export const NAV_LINKS = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/work",
    label: "Work",
  },
  {
    href: "/posts",
    label: "Writing",
  },
  {
    href: "/about",
    label: "About",
  },
];

export const CONTACT = {
  email: "navinservicesnv000@gmail.com",
  github: "https://github.com/kyoo-147",
  linkedin: "https://www.linkedin.com/in/minh-cuong-bui/",
  location: "Vietnam",
};

export const SOCIAL_LINKS = [
  {
    href: CONTACT.github,
    label: "GitHub",
  },
  {
    href: CONTACT.linkedin,
    label: "LinkedIn",
  },
  {
    href: `mailto:${CONTACT.email}`,
    label: "Email",
  },
  {
    href: "/rss.xml",
    label: "RSS",
  },
] as const;

export const ICON_MAP: Record<string, string> = {
  GitHub: "github",
  LinkedIn: "linkedin",
  RSS: "rss",
  Email: "mail",
};
