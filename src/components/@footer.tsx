import Link from 'next/link';
import {getTranslations} from 'next-intl/server';

type Props = {
  locale: string;
};

export default async function Footer({locale}: Props) {
  const t = await getTranslations({locale, namespace: 'Footer'});
  const footerLinks = [
    {href: '/privacy', label: t('links.privacy')},
    {href: '/terms', label: t('links.terms')},
    {href: '/careers', label: t('links.careers')}
  ];

  return (
    <footer id="contact" className="border-t border-black/10 bg-gray-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 md:flex-row md:justify-between">
        <div className="max-w-xl space-y-3 text-gray-800">
          <p className="text-lg font-semibold text-gray-900">{t('tagline')}</p>
          <p className="text-sm text-gray-600">{t('address')}</p>
          <div className="text-sm text-gray-600">
            <p>{t('contactEmail')}</p>
            <p>{t('contactPhone')}</p>
          </div>
        </div>
        <div className="flex flex-col gap-3 text-sm text-gray-600">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-gray-900">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="border-t border-black/5 px-6 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} {t('tagline')} · {t('copyright')}
      </div>
    </footer>
  );
}

