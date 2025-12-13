/**
 * 支持的语言列表配置
 * 在这里统一管理所有支持的语言代码
 */
export const locales = ['en', 'zh', 'fr', 'de', 'es', 'ja', 'ar'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

/**
 * 语言标志映射
 */
export const flagMap: Record<Locale, string> = {
  en: '🇺🇸',
  zh: '🇨🇳',
  ja: '🇯🇵',
  fr: '🇫🇷',
  de: '🇩🇪',
  es: '🇪🇸',
  ar: '🇸🇦',
};

