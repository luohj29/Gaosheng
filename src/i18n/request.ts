import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async ({locale}) => {
const currentLocale = locale ?? 'en';  // <-- fallback 确保一定是 string
  return {
    locale: currentLocale,
    messages: (await import(`../../messages/${currentLocale}.json`)).default
  };
});
