import {getTranslations} from 'next-intl/server';

type Props = {
  locale: string;
};

export default async function StudioSection({locale}: Props) {
  const t = await getTranslations({locale, namespace: 'HomePage'});
  const studioStatKeys: Array<'projects' | 'cities' | 'materials'> = [
    'projects',
    'cities',
    'materials'
  ];

  return (
    <section id="studio" className="space-y-6">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-400">
        {t('studioHeading')}
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        {studioStatKeys.map((key) => (
          <div
            key={key}
            className="rounded-3xl border border-black/10 bg-gray-50 p-6 text-center shadow-[0_20px_50px_-45px_rgba(0,0,0,0.8)]"
          >
            <p className="text-3xl font-semibold text-gray-900">{t(`studioStats.${key}.value`)}</p>
            <p className="text-sm text-gray-600">{t(`studioStats.${key}.label`)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

