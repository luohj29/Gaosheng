import { notFound } from 'next/navigation';
import { getNewsPost, getNewsPosts } from '@/src/lib/md-utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const posts = await getNewsPosts(locale);
  return posts.map((post) => ({
    slug: post.slug,
  }));
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

