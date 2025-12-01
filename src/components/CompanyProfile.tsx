import { getTranslations } from 'next-intl/server';
import CompanyVideoPlayer from './CompanyVideoPlayer';

type Props = {
  locale: string;
};

// Helper function to convert youtu.be/xxx to YouTube embed URL
function getYouTubeEmbedUrl(url: string): string {
  // Handle youtu.be/xxx format
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  // Handle youtube.com/watch?v=xxx format
  if (url.includes('youtube.com/watch?v=')) {
    const videoId = url.split('v=')[1]?.split('&')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  // Handle youtube.com/embed/xxx format (already embed)
  if (url.includes('youtube.com/embed/')) {
    return url;
  }
  // Default: assume it's already an embed URL or return as is
  return url;
}

export default async function CompanyProfile({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'HomePage' });
  const profileItems: Array<'profile' | 'products' | 'quality'> = [
    'profile',
    'products',
    'quality'
  ];

  // Prepare video data for the video player
  const videos = profileItems.map((key) => {
    const videoUrl = t(`companyProfileItems.${key}.videoUrl`);
    const embedUrl = getYouTubeEmbedUrl(videoUrl);
    return {
      id: key,
      title: t(`companyProfileItems.${key}.title`),
      description: t(`companyProfileItems.${key}.description`),
      embedUrl,
    };
  });

  return (
    <section id="company-profile" className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-400">
          {t('companyProfileHeading')}
        </p>
        <p className="text-gray-600">{t('companyProfileDescription')}</p>
      </div>
      
      {/* 大视频展示栏 */}
      <CompanyVideoPlayer videos={videos} />

      {/* 三个信息卡片 */}
      {/* <div className="grid gap-6 md:grid-cols-3">
        {profileItems.map((key) => (
          <article
            key={key}
            className="rounded-3xl border border-black/10 bg-white/60 p-6 shadow-[0_15px_45px_-35px_rgba(0,0,0,0.7)]"
          >
            <h3 className="text-lg font-semibold text-gray-900">
              {t(`companyProfileItems.${key}.title`)}
            </h3>
            <p className="text-sm text-gray-600 mt-3">
              {t(`companyProfileItems.${key}.description`)}
            </p>
            <button className="mt-4 text-sm font-medium text-gray-900 hover:text-gray-700">
              {t('readMore')} →
            </button>
          </article>
        ))}
      </div> */}
    </section>
  );
}

