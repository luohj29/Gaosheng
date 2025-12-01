import {getTranslations} from 'next-intl/server';

type Props = {
  locale: string;
};

export default async function FollowUs({locale}: Props) {
  const t = await getTranslations({locale, namespace: 'HomePage'});
  const socialLinks: Array<'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube'> = [
    'facebook',
    'twitter',
    'instagram',
    'linkedin',
    'youtube'
  ];

  return (
    <section id="follow-us" className="space-y-6">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-400">
          {t('followUsHeading')}
        </p>
        <p className="text-gray-600">{t('followUsDescription')}</p>
      </div>
      <div className="flex flex-wrap gap-4">
        {socialLinks.map((key) => (
          <a
            key={key}
            href={t(`followUsLinks.${key}.url`)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-6 py-3 text-sm font-medium text-gray-900 transition hover:border-gray-900 hover:bg-gray-50 hover:shadow-md"
          >
            <span>{t(`followUsLinks.${key}.label`)}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

