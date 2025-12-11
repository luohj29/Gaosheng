import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'zh', 'fr', 'de', 'es', 'ja', 'ar'],
  defaultLocale: 'en'
});

export const config = {
  // 匹配所有路径，但排除静态资源
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
