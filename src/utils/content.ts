import { getCollection, type CollectionEntry } from "astro:content";
import type { Locale } from "@/i18n/config";
import getSortedPosts from "./getSortedPosts";

const SITE_POST_SOURCE = "michael";
const FEATURED_WORK_SLUGS = [
  "moyi-edge-translation",
  "sandora",
  "autonomous-vehicle-research",
  "dossier",
  "computer-vision-qc-system",
];

const WORK_PRIORITY_SLUGS = [
  "moyi-edge-translation",
  "sandora",
  "dossier",
  "everdock-desktop",
  "together-working",
  "oneclick-crm",
  "workwise",
  "computer-vision-qc-system",
  "autonomous-vehicle-research",
  "snow-ai-companion",
];

function matchesLocale<T extends { data: { locale?: string } }>(
  entry: T,
  locale: Locale,
) {
  return (entry.data.locale ?? "en") === locale;
}

export async function getLocalizedPosts(locale: Locale) {
  const posts = await getCollection(
    "blog",
    entry =>
      matchesLocale(entry, locale) &&
      !entry.data.draft &&
      entry.data.source === SITE_POST_SOURCE,
  );
  return getSortedPosts(posts);
}

export async function getLocalizedFeaturedPosts(locale: Locale, limit = 4) {
  const posts = await getLocalizedPosts(locale);
  const featured = posts.filter(post => post.data.featured).slice(0, limit);
  return featured.length > 0 ? featured : posts.slice(0, limit);
}

export async function getLocalizedRecentPosts(locale: Locale, limit = 4) {
  const posts = await getLocalizedPosts(locale);
  return posts.slice(0, limit);
}

export async function getLocalizedWork(locale: Locale) {
  const entries = await getCollection(
    "work",
    entry => matchesLocale(entry, locale) && !entry.data.draft,
  );

  const getWorkSortYear = (entry: CollectionEntry<"work">) => {
    const years = entry.data.period.match(/\d{4}/g);
    if (!years) return 0;
    return Math.max(...years.map(year => Number(year)));
  };

  return [...entries].sort((a, b) => {
    const priorityA = WORK_PRIORITY_SLUGS.indexOf(getWorkSlug(a.id));
    const priorityB = WORK_PRIORITY_SLUGS.indexOf(getWorkSlug(b.id));
    if (priorityA !== priorityB) {
      if (priorityA === -1) return 1;
      if (priorityB === -1) return -1;
      return priorityA - priorityB;
    }
    if (a.data.featured !== b.data.featured) {
      return Number(b.data.featured) - Number(a.data.featured);
    }
    if (a.data.order !== b.data.order) {
      return a.data.order - b.data.order;
    }
    const yearDiff = getWorkSortYear(b) - getWorkSortYear(a);
    if (yearDiff !== 0) {
      return yearDiff;
    }
    return a.data.title.localeCompare(b.data.title);
  });
}

export async function getLocalizedFeaturedWork(locale: Locale, limit = 4) {
  const work = await getLocalizedWork(locale);
  const selected = FEATURED_WORK_SLUGS
    .map(slug => work.find(entry => getWorkSlug(entry.id) === slug))
    .filter((entry): entry is CollectionEntry<"work"> => Boolean(entry));
  const fallback = work.filter(
    entry => entry.data.featured && !FEATURED_WORK_SLUGS.includes(getWorkSlug(entry.id)),
  );
  return [...selected, ...fallback].slice(0, limit);
}

export function getWorkSlug(id: string) {
  return id.replace(/^(en|vi|zh-cn)\//, "");
}

export function getPostSlug(id: string) {
  return id.replace(/^(en|vi|zh-cn)\//, "");
}

export function findEntryBySlug<T extends CollectionEntry<"blog" | "work">>(
  entries: T[],
  slug: string,
) {
  return entries.find(entry => entry.id === slug);
}
