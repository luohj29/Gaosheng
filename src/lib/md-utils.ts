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
  // Fallback to 'en' if locale directory doesn't exist, or handle error
  const localeDir = path.join(postsDirectory, locale);
  
  if (!fs.existsSync(localeDir)) {
    console.warn(`Directory not found for locale: ${locale}`);
    return [];
  }

  const filenames = fs.readdirSync(localeDir);

  const posts = filenames
    .filter((filename) => filename.endsWith('.md'))
    .map((filename) => {
      const filePath = path.join(localeDir, filename);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);
      const slug = filename.replace(/\.md$/, '');

      return {
        slug,
        title: data.title,
        date: data.date,
        description: data.description,
        image: data.image,
        content,
      } as NewsPost;
    });

  // Sort posts by date (newest first)
  return posts.sort((a, b) => (a.date > b.date ? -1 : 1));
}

export async function getNewsPost(locale: string, slug: string): Promise<NewsPost | null> {
  const fullPath = path.join(postsDirectory, locale, `${slug}.md`);
  
  if (!fs.existsSync(fullPath)) {
    return null;
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

