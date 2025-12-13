import { notFound } from 'next/navigation';
import { getNewsPost, getNewsPosts } from '@/src/lib/md-utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';
import Link from 'next/link';
import { locales } from '@/src/i18n/config';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const params: Array<{ locale: string; slug: string }> = [];
  
  for (const locale of locales) {
    const posts = await getNewsPosts(locale);
    for (const post of posts) {
      params.push({
        locale,
        slug: post.slug,
      });
    }
  }
  
  return params;
}

export default async function NewsPostPage(props: Props) {
  const params = await props.params;
  const { locale, slug } = params;

  const post = await getNewsPost(locale, slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      {/* Breadcrumb / Back Link */}
      <div className="mb-8">
        <Link 
          href={`/${locale}/news`}
          className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          ← Back to News
        </Link>
      </div>

      <article>
        {/* Content */}
        <div className="prose prose-lg prose-gray mx-auto max-w-none prose-headings:font-bold prose-img:rounded-xl prose-img:shadow-md">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
}

