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
  const enDir = path.join(productsDirectory, 'en');
  
  // Get all products from the specified locale directory
  const localeProducts: Map<string, Product> = new Map();
  if (fs.existsSync(localeDir)) {
    const localeFilenames = fs.readdirSync(localeDir);
    localeFilenames
      .filter((filename) => filename.endsWith('.md'))
      .forEach((filename) => {
        const filePath = path.join(localeDir, filename);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContents);
        const slug = filename.replace(/\.md$/, '');

        localeProducts.set(slug, {
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
        } as Product);
      });
  }

  // Get all products from 'en' directory as fallback
  if (!fs.existsSync(enDir)) {
    console.warn(`Directory not found for locale: en`);
    return Array.from(localeProducts.values());
  }

  const enFilenames = fs.readdirSync(enDir);
  enFilenames
    .filter((filename) => filename.endsWith('.md'))
    .forEach((filename) => {
      const slug = filename.replace(/\.md$/, '');
      
      // Only use 'en' version if locale-specific version doesn't exist
      if (!localeProducts.has(slug)) {
        const filePath = path.join(enDir, filename);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContents);

        localeProducts.set(slug, {
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
        } as Product);
      }
    });

  return Array.from(localeProducts.values());
}

export async function getProduct(locale: string, slug: string): Promise<Product | null> {
  // Try to use the specified locale, fallback to 'en' if not found
  let fullPath = path.join(productsDirectory, locale, `${slug}.md`);
  
  if (!fs.existsSync(fullPath)) {
    // Fallback to 'en' if the locale-specific file doesn't exist
    fullPath = path.join(productsDirectory, 'en', `${slug}.md`);
    
    if (!fs.existsSync(fullPath)) {
      return null;
    }
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
