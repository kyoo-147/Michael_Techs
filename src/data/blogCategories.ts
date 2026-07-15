export const BLOG_CATEGORY_VALUES = [
  "Technical",
  "AI",
  "Product",
  "Experience",
  "Books",
  "Life",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORY_VALUES)[number];

export const BLOG_CATEGORY_QUERY: Record<BlogCategory, string> = {
  Technical: "technical",
  AI: "ai",
  Product: "product",
  Experience: "experience",
  Books: "books",
  Life: "life",
};

export const BLOG_CATEGORY_ORDER: BlogCategory[] = [
  "Technical",
  "AI",
  "Product",
  "Experience",
  "Books",
  "Life",
];

export const BLOG_CATEGORY_ITEMS = BLOG_CATEGORY_ORDER.map(category => ({
  category,
  query: BLOG_CATEGORY_QUERY[category],
}));

export function getCategoryFromQueryValue(value: string | null | undefined) {
  if (!value) return null;
  return (
    BLOG_CATEGORY_ORDER.find(category => BLOG_CATEGORY_QUERY[category] === value) ??
    null
  );
}
