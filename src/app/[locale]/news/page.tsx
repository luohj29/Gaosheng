import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { getNewsPosts } from '@/src/lib/md-utils';
import Image from 'next/image';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function NewsPage(props: Props) {
  const params = await props.params;
  const { locale } = params;

  const t = await getTranslations({ locale, namespace: 'NewsPage' });
  const posts = await getNewsPosts(locale);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-16">
      <section className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-gray-400">
          {t('heroEyebrow')}
        </p>
        <h1 className="text-3xl font-semibold text-gray-900 md:text-4xl">{t('heroTitle')}</h1>
        <p className="text-lg text-gray-600">{t('heroBody')}</p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">{t('listHeading')}</h2>
        <div className="space-y-6">
          {posts.length === 0 ? (
            <p className="text-gray-500">No news available at the moment.</p>
          ) : (
            posts.map((post) => (
              <Link
                key={post.slug}
                href={`/${locale}/news/${post.slug}`}
                className="flex flex-col gap-6 rounded-3xl border border-black/10 bg-white/70 p-6 shadow-sm transition-shadow hover:shadow-md md:flex-row group"
              >
                <div className="relative h-48 md:h-auto md:w-1/3 rounded-2xl overflow-hidden bg-gray-100">
                  {post.image ? (
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                <div className="flex flex-[2] flex-col gap-3 justify-center">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-theme transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-3">{post.description}</p>
                  <p className="text-xs font-medium uppercase tracking-[0.3em] text-gray-400 mt-2">
                    {post.date}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
