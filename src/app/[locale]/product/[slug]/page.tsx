import { notFound } from 'next/navigation';
import { getProduct, getProducts } from '@/src/lib/product-utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import Link from 'next/link';
import ProductDetailCarousel from '@/src/components/ProductDetailCarousel';
import { locales } from '@/src/i18n/config';
import { CONTACT_INFO } from '@/src/config/constants';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const params: Array<{ locale: string; slug: string }> = [];
  
  for (const locale of locales) {
    const products = await getProducts(locale);
    for (const product of products) {
      params.push({
        locale,
        slug: product.slug,
      });
    }
  }
  
  return params;
}

// 预处理函数，将特殊标记转换为 HTML 网格（支持 mxn 网格）
function processMarkdownWithGrids(content: string): string {
  // 匹配 <!--grid:MxN--> 格式，例如 <!--grid:2x2-->, <!--grid:3x3-->, <!--grid:2x3--> 等
  const gridPattern = /<!--grid:(\d+)x(\d+)-->([\s\S]*?)<!--endgrid-->/g;
  
  return content.replace(gridPattern, (match, cols, rows, imagesContent) => {
    // 解析列数和行数
    const numCols = parseInt(cols, 10) || 2;
    const numRows = parseInt(rows, 10) || 2;
    
    // 提取所有图片链接
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    const images: Array<{ alt: string; src: string }> = [];
    let imageMatch;
    
    while ((imageMatch = imageRegex.exec(imagesContent)) !== null) {
      images.push({
        alt: (imageMatch[1] || '').replace(/"/g, '&quot;'), // 转义引号
        src: imageMatch[2],
      });
    }
    
    // 如果找到图片，转换为 HTML 网格（使用紧凑格式，避免多余空格）
    if (images.length > 0) {
      const gridItems = images
        .map(
          (img) => `<div class="flex justify-center"><img src="${img.src}" alt="${img.alt}" class="rounded-2xl shadow-lg w-full h-full max-h-full object-contain border border-gray-300" /></div>`
        )
        .join('');
      
      // 使用内联样式设置列数，因为 Tailwind 需要完整的类名
      const gridColsStyle = `grid-template-columns: repeat(${numCols}, minmax(0, 1fr));`;
      return `<div class="grid my-8 max-w-7xl mx-auto" style="${gridColsStyle}">${gridItems}</div>`;
    }
    
    return match; // 如果没有找到图片，返回原内容
  });
}

export default async function ProductDetailPage(props: Props) {
  const params = await props.params;
  const { locale, slug } = params;

  const product = await getProduct(locale, slug);

  if (!product) {
    notFound();
  }

  // 预处理 markdown 内容，将特殊标记转换为 HTML 网格
  const processedContent = processMarkdownWithGrids(product.content);

  const variantImages =
    product.variants
      ?.map((variant) => (typeof variant === 'string' ? variant : variant.image))
      .filter((img): img is string => Boolean(img)) ?? [];

  const galleryImages = Array.from(new Set([...(product.images ?? []), ...variantImages]));

  return (
    <div className="mx-auto max-w-7xl px-20 py-12 md:py-5">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-gray-500">
        <Link href={`/${locale}/product`} className="hover:text-gray-900">
          Product
        </Link>
        <span>/</span>
        <span className="font-medium text-gray-900">{product.title}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Left Column: Images */}
        <div>
          <ProductDetailCarousel
            images={galleryImages}
          />
        </div>

        {/* Right Column: Info */}
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
              {product.title}
            </h1>
            <div className="mt-2 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-600">
              {product.category}
            </div>
          </div>

          <div className="text-lg text-gray-600 leading-relaxed">
            {product.description}
          </div>

          {product.features && product.features.length > 0 && (
            <div className="rounded-2xl bg-gray-50 p-6">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900">
                Key Features
              </h3>
              <ul className="space-y-1">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="mt-1.5 block h-1 w-1 rounded-full bg-blue-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <a
              href={`mailto:${CONTACT_INFO.email}`}
              className="inline-flex w-full items-center justify-center rounded-full bg-gray-900 px-8 py-4 text-base font-medium text-white transition-colors hover:bg-gray-800 md:w-auto"
            >
              Send Inquiry
            </a>
          </div>
        </div>
      </div>

      {/* Divider */}
      <hr className="my-16 border-gray-200" />

      {/* Content Sections */}
      <div className="mx-auto max-w-7xl space-y-12">
        {/* Video Section */}
        {product.videoUrl && (
          <div className="mt-12">
            <h2 className="mb-6 text-2xl font-bold">Product Video</h2>
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-lg">
              <iframe
                src={product.videoUrl}
                title={product.title}
                className="absolute inset-0 h-full w-full"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}
        {/* Main Content (Markdown) */}
        <div className="prose prose-lg prose-gray max-w-none w-full prose-headings:font-bold prose-img:rounded-2xl prose-img:shadow-lg prose-img:max-w-6xl prose-img:mx-auto prose-figure:w-full">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              p: ({ children }) => (
                <div className="rounded-2xl bg-gray-50 p-6 my-4 text-gray-700 leading-relaxed">
                  {children}
                </div>
              ),
            }}
          >
            {processedContent}
          </ReactMarkdown>

          {product.specifications && product.specifications.length > 0 && (
            <div className="mt-12 rounded-3xl border border-gray-200 p-6">
              <h3 className="mb-6 text-lg font-bold text-gray-900">Specifications</h3>
              <dl className="divide-y divide-gray-100">
                {product.specifications.map((spec, idx) => (
                  <div key={idx} className="grid grid-cols-[1fr_1.5fr] gap-2 py-3">
                    <dt className="text-sm font-medium text-gray-500">{spec.label}</dt>
                    <dd className="text-sm font-medium text-gray-900 text-right">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
