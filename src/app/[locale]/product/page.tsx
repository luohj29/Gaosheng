import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { getProducts } from '@/src/lib/product-utils';
import '@/public/css/color.css';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ProductPage(props: Props) {
  const params = await props.params;
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: 'ProductPage' });
  const products = await getProducts(locale);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-16">
      <section className="space-y-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-gray-400">
          {t('heroEyebrow')}
        </p>
        <h1 className="text-3xl font-semibold text-gray-900 md:text-4xl">{t('heroTitle')}</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t('heroBody')}</p>
      </section>

      <section className="space-y-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Link
              key={product.slug}
              href={`/${locale}/product/${product.slug}`}
              className="group flex flex-col gap-4 rounded-3xl border border-black/10 bg-white p-6 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-white">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[0]}
                    alt={product.title}
                    fill
                    className="object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[#00919E]">
                  {product.category}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 transition-colors text-color">
                    {product.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
              </div>
            </Link>
          ))}
        </div>
        {products.length === 0 && (
            <div className="text-center py-12 text-gray-500">
                No products found.
            </div>
        )}
      </section>
    </div>
  );
}
