import {getTranslations} from 'next-intl/server';
import { getNewsPosts } from '@/src/lib/md-utils';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
  locale: string;
};

export default async function News({locale}: Props) {
  const t = await getTranslations({locale, namespace: 'HomePage'});
  const posts = await getNewsPosts(locale);
  
  // Only show latest 3 posts on homepage
  const recentPosts = posts.slice(0, 3);

  return (
    <section id="news" className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-400">
          {t('newsHeading')}
        </p>
        <p className="text-gray-600">{t('newsDescription')}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {recentPosts.length > 0 ? (
          recentPosts.map((post) => (
            <Link 
              href={`/${locale}/news/${post.slug}`}
              key={post.slug}
              className="block h-full"
            >
              <article
                className="h-full flex flex-col rounded-3xl border border-black/10 bg-white/80 p-6 shadow-[0_15px_45px_-35px_rgba(0,0,0,0.7)] transition-transform hover:scale-[1.02]"
              >
                <div className="relative h-48 rounded-2xl bg-gray-100 overflow-hidden">
                  {post.image ? (
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300" />
                  )}
                </div>
                <h3 className="pt-5 text-xl font-semibold text-gray-900 line-clamp-2">
                  {post.title}
                </h3>
                <p className="pt-2 text-sm text-gray-600 line-clamp-3 flex-grow">
                  {post.description}
                </p>
                <p className="pt-4 text-xs text-gray-500">
                  {post.date}
                </p>
              </article>
            </Link>
          ))
        ) : (
          <div className="col-span-3 text-center text-gray-500 py-8">
            No news available.
          </div>
        )}
      </div>
    </section>
  );
}
