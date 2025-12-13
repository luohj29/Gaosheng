import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './src/i18n/config';

export default createMiddleware({
  locales,
  defaultLocale
});

export const config = {
  // 匹配所有路径，但排除静态资源
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
