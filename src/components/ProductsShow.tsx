import {getTranslations} from 'next-intl/server';
import ProductCarousel from './ProductCarousel';

type Props = {
  locale: string;
};

export default async function ProductsShow({locale}: Props) {
  const t = await getTranslations({locale, namespace: 'HomePage'});
  // 使用 raw 读取对象而非字符串，确保能拿到所有产品键
  const productsMeta = t.raw('productsShowItems') as Record<
    string,
    {title: string; description: string}
  >;
  const productKeys = Object.keys(productsMeta);

  // Prepare product data from translations
  const products = productKeys.map((key) => ({
    id: key,
    title: productsMeta[key]?.title ?? '',
    description: productsMeta[key]?.description ?? '',
  }));

  return (
    <section id="products-show" className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-400">
          {t('productsShowHeading')}
        </p>
        <p className="text-gray-600">{t('productsShowDescription')}</p>
      </div>
      <ProductCarousel products={products} itemsPerPage={5} />
    </section>
  );
}
