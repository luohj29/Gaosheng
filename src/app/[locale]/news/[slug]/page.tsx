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
        {/* Header */}
        <header className="mb-10 space-y-6 text-center">
          <div className="text-sm font-semibold uppercase tracking-widest text-gray-400">
            {post.date}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
            {post.title}
          </h1>
          {post.description && (
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {post.description}
            </p>
          )}
        </header>

        {/* Featured Image */}
        {post.image && (
          <div className="relative w-full h-[400px] md:h-[500px] mb-12 rounded-2xl overflow-hidden shadow-lg">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

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

