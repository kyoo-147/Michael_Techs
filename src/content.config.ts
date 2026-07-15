import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { SITE } from "@/config";
import { BLOG_CATEGORY_VALUES } from "@/data/blogCategories";

export const BLOG_PATH = "src/content/blog";
export const WORK_PATH = "src/content/work";

const linkSchema = z.object({
  label: z.string(),
  href: z.string(),
  note: z.string().optional(),
});

const metricSchema = z.object({
  value: z.string(),
  label: z.string(),
});

const mediaSchema = z.object({
  src: z.string().optional(),
  label: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  href: z.string().optional(),
});

const timelineSchema = z.object({
  label: z.string(),
  date: z.string(),
});

const storyBlockSchema = z.object({
  title: z.string(),
  body: z.string(),
  image: z.string().optional(),
});

const deploymentMatrixSchema = z.object({
  title: z.string(),
  note: z.string().optional(),
  rows: z.array(z.object({
    deviceGroup: z.string(),
    runtime: z.string(),
    evaluation: z.string(),
  })),
});

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: `./${BLOG_PATH}` }),
  schema: ({ image }) =>
    z.object({
      author: z.string().default(SITE.author),
      locale: z.enum(["en", "vi", "zh-cn"]).default("en"),
      pubDatetime: z.coerce.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      unlisted: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      categories: z.array(z.enum(BLOG_CATEGORY_VALUES)).default([]),
      ogImage: image().or(z.string()).optional(),
      heroImage: z.string().optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      hideEditPost: z.boolean().optional(),
      timezone: z.string().optional(),
      source: z.string().default("michael"),
      AIDescription: z.boolean().optional(),
    }),
});

const work = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: `./${WORK_PATH}` }),
  schema: z.object({
    locale: z.enum(["en", "vi", "zh-cn"]).default("en"),
    title: z.string(),
    summary: z.string(),
    description: z.string(),
    overview: z.string().optional(),
    problem: z.string().optional(),
    approach: z.string().optional(),
    role: z.string(),
    period: z.string(),
    draft: z.boolean().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(0),
    outcomes: z.array(z.string()).default([]),
    metrics: z.array(metricSchema).default([]),
    links: z.array(linkSchema).default([]),
    heroLabel: z.string().optional(),
    heroImage: z.string().optional(),
    highlights: z.array(mediaSchema).default([]),
    video: mediaSchema.optional(),
    timeline: z.array(timelineSchema).default([]),
    storyBlocks: z.array(storyBlockSchema).default([]),
    deploymentMatrix: deploymentMatrixSchema.optional(),
    gallery: z.array(mediaSchema).default([]),
    ctaLabel: z.string().optional(),
    ctaHref: z.string().optional(),
    showBody: z.boolean().optional(),
  }),
});

export const collections = { blog, work };
