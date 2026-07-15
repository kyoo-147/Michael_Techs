export const LOCALES = ["en", "vi", "zh-cn"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const NON_DEFAULT_LOCALES = LOCALES.filter(
  locale => locale !== DEFAULT_LOCALE,
) as Exclude<Locale, typeof DEFAULT_LOCALE>[];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "EN",
  vi: "VN",
  "zh-cn": "CN",
};

export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  vi: "Tiếng Việt",
  "zh-cn": "简体中文",
};

export const HTML_LANG: Record<Locale, string> = {
  en: "en",
  vi: "vi",
  "zh-cn": "zh-CN",
};
