import { CONTACT, SITE } from "./consts";

export const SOCIALS = [
  {
    name: "Github",
    href: CONTACT.github,
    linkTitle: `${SITE.title} on Github`,
    icon: "github",
    active: true,
  },
  {
    name: "X",
    href: "https://x.com/mih_cuog",
    linkTitle: `${SITE.title} on X`,
    icon: "twitter",
    active: true,
  },
  {
    name: "LinkedIn",
    href: CONTACT.linkedin,
    linkTitle: `${SITE.title} on LinkedIn`,
    icon: "linkedin",
    active: true,
  },
  {
    name: "Mail",
    href: `mailto:${CONTACT.email}`,
    linkTitle: `Send an email to ${SITE.title}`,
    icon: "mail",
    active: true,
  },
] as const;

export const SHARE_LINKS = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/sharing/share-offsite/?url=",
    linkTitle: "Share this page on LinkedIn",
    icon: "linkedin",
  },
  {
    name: "Mail",
    href: "mailto:?subject=See%20this%20page&body=",
    linkTitle: "Share this page via email",
    icon: "mail",
  },
] as const;
