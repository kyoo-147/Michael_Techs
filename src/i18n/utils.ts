import { DEFAULT_LOCALE, HTML_LANG, LOCALES, type Locale } from "./config";
import { ui } from "./ui";

export function isLocale(value: string | undefined): value is Locale {
  return !!value && LOCALES.includes(value as Locale);
}

export function normalizeLocale(value: string | undefined): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export function getLocaleFromPathname(pathname: string): Locale {
  const [, firstSegment] = pathname.split("/");
  return normalizeLocale(firstSegment);
}

export function stripLocaleFromPathname(pathname: string) {
  const locale = getLocaleFromPathname(pathname);
  if (locale === DEFAULT_LOCALE) {
    return pathname || "/";
  }

  const withoutPrefix = pathname.replace(`/${locale}`, "");
  return withoutPrefix === "" ? "/" : withoutPrefix;
}

export function getLocalizedPath(locale: Locale, pathname = "/") {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (locale === DEFAULT_LOCALE) {
    return normalized;
  }
  return normalized === "/" ? `/${locale}` : `/${locale}${normalized}`;
}

export function switchLocalePath(pathname: string, targetLocale: Locale) {
  return getLocalizedPath(targetLocale, stripLocaleFromPathname(pathname));
}

export function useTranslations(locale: Locale) {
  return ui[locale];
}

export function getHtmlLang(locale: Locale) {
  return HTML_LANG[locale];
}
