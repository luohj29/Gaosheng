import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export type ProductSpec = {
  label: string;
  value: string;
};

export type ProductVariant =
  | {
      name: string;
      image: string;
      colorCode?: string;
    }
  | string;

export type Product = {
  slug: string;
  title: string;
  description: string;
  images: string[];
  variants?: ProductVariant[];
  videoUrl?: string;
  category: string;
  features?: string[];
  specifications?: ProductSpec[];
  content: string;
};

const productsDirectory = path.join(process.cwd(), 'products_md');

export async function getProducts(locale: string): Promise<Product[]> {
  const localeDir = path.join(productsDirectory, locale);
  
  if (!fs.existsSync(localeDir)) {
    console.warn(`Directory not found for locale: ${locale}`);
    return [];
  }

  const filenames = fs.readdirSync(localeDir);

  const products = filenames
    .filter((filename) => filename.endsWith('.md'))
    .map((filename) => {
      const filePath = path.join(localeDir, filename);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);
      const slug = filename.replace(/\.md$/, '');

      return {
        slug,
        title: data.title,
        description: data.description,
        images: data.images || [],
        variants: data.variants || [],
        videoUrl: data.videoUrl,
        category: data.category,
        features: data.features,
        specifications: data.specifications,
        content,
      } as Product;
    });

  return products;
}

export async function getProduct(locale: string, slug: string): Promise<Product | null> {
  const fullPath = path.join(productsDirectory, locale, `${slug}.md`);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title,
    description: data.description,
    images: data.images || [],
    variants: data.variants || [],
    videoUrl: data.videoUrl,
    category: data.category,
    features: data.features,
    specifications: data.specifications,
    content,
  } as Product;
}
