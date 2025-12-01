import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import LanguageSwitcher from '@/src/components/LanguageSwitcher';

type Props = {
  locale: string;
};

export default async function Navbar({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'Navigation' });
  const menuItems = [
    { path: '', label: t('menu.home') },
    { path: 'about', label: t('menu.about') },
    { path: 'product', label: t('menu.product') },
    { path: 'news', label: t('menu.news') },
    { path: 'contact', label: t('menu.contact') }
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-gray-100 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link href={`/${locale}`} className="text-lg font-semibold tracking-wide text-gray-900">
          <img
            src="/icon/logo.png" alt="logo"
             />
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-gray-600 md:flex">
          {menuItems.map((item) => (
            <Link
              key={item.path || 'home'}
              href={item.path ? `/${locale}/${item.path}` : `/${locale}`}
              className="transition hover:text-gray-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3 text-sm font-medium">
          {/* <button className="rounded-full border border-gray-200 px-4 py-2 text-gray-700 transition hover:border-gray-900 hover:text-gray-900">
            {t('ctaSecondary')}
          </button>
          <button className="rounded-full bg-gray-900 px-4 py-2 text-white transition hover:bg-gray-700">
            {t('ctaPrimary')}
          </button> */}
          {/* 这里加入语言切换器 */}
          <LanguageSwitcher locale={locale} />
        </div>
      </div>
    </header>
  );
}

