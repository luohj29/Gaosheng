import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export type NewsPost = {
  slug: string;
  title: string;
  date: string;
  description: string;
  image?: string;
  content: string;
};

const postsDirectory = path.join(process.cwd(), 'news_md');

export async function getNewsPosts(locale: string): Promise<NewsPost[]> {
  const localeDir = path.join(postsDirectory, locale);
  const enDir = path.join(postsDirectory, 'en');
  
  // Get all posts from the specified locale directory
  const localePosts: Map<string, NewsPost> = new Map();
  if (fs.existsSync(localeDir)) {
    const localeFilenames = fs.readdirSync(localeDir);
    localeFilenames
      .filter((filename) => filename.endsWith('.md'))
      .forEach((filename) => {
        const filePath = path.join(localeDir, filename);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContents);
        const slug = filename.replace(/\.md$/, '');

        localePosts.set(slug, {
          slug,
          title: data.title,
          date: data.date,
          description: data.description,
          image: data.image,
          content,
        } as NewsPost);
      });
  }

  // Get all posts from 'en' directory as fallback
  if (!fs.existsSync(enDir)) {
    console.warn(`Directory not found for locale: en`);
    return Array.from(localePosts.values()).sort((a, b) => (a.date > b.date ? -1 : 1));
  }

  const enFilenames = fs.readdirSync(enDir);
  enFilenames
    .filter((filename) => filename.endsWith('.md'))
    .forEach((filename) => {
      const slug = filename.replace(/\.md$/, '');
      
      // Only use 'en' version if locale-specific version doesn't exist
      if (!localePosts.has(slug)) {
        const filePath = path.join(enDir, filename);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContents);

        localePosts.set(slug, {
          slug,
          title: data.title,
          date: data.date,
          description: data.description,
          image: data.image,
          content,
        } as NewsPost);
      }
    });

  // Sort posts by date (newest first)
  return Array.from(localePosts.values()).sort((a, b) => (a.date > b.date ? -1 : 1));
}

export async function getNewsPost(locale: string, slug: string): Promise<NewsPost | null> {
  // Try to use the specified locale, fallback to 'en' if not found
  let fullPath = path.join(postsDirectory, locale, `${slug}.md`);
  
  if (!fs.existsSync(fullPath)) {
    // Fallback to 'en' if the locale-specific file doesn't exist
    fullPath = path.join(postsDirectory, 'en', `${slug}.md`);
    
    if (!fs.existsSync(fullPath)) {
      return null;
    }
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title,
    date: data.date,
    description: data.description,
    image: data.image,
    content,
  } as NewsPost;
}

