import Footer from '@/src/components/@footer';
import Navbar from '@/src/components/@navbar';
import {NextIntlClientProvider} from 'next-intl';
import {notFound} from 'next/navigation';
import ContactInfo from '@/src/components/contact_info';
import {getTranslations} from 'next-intl/server';
import type {Metadata} from 'next';

type Props = {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
};

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Metadata'});
  
  return {
    title: t('title'),
    description: t('description'),
    icons: {
      icon: [
        { url: '/favicon.png', type: 'image/png' },
      ],
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      siteName: t('siteName'),
      type: 'website',
    },
    metadataBase: new URL('https://www.gaoshenghk.com'),
  };
}

export default async function RootLayout({children, params}: Props) {
  const {locale} = await params;
  let messages;
  try {
    messages = (await import(`../../../messages/${locale}.json`)).default;
  } catch {
    notFound();
  }

  return (
    <html lang={locale}>
      <body className="bg-white text-gray-900 antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Navbar locale={locale} />
          <main>{children}</main>
          <ContactInfo />
          <Footer locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return [
    { locale: "en" },
    { locale: "zh" },
    { locale: "fr" },
    { locale: "de" },
    { locale: "es" },
    { locale: "ja" },
    { locale: "ar" },
  ];
}