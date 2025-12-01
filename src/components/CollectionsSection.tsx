import {getTranslations} from 'next-intl/server';

type Props = {
  locale: string;
};

export default async function CollectionsSection({locale}: Props) {
  const t = await getTranslations({locale, namespace: 'HomePage'});
  const collectionKeys: Array<'living' | 'workspace' | 'dining'> = [
    'living',
    'workspace',
    'dining'
  ];

  return (
    <section id="collections" className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-400">
          {t('collectionsHeading')}
        </p>
        <p className="text-gray-600">{t('collectionsDescription')}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {collectionKeys.map((key) => (
          <article
            key={key}
            className="rounded-3xl border border-black/10 bg-white/60 p-6 shadow-[0_15px_45px_-35px_rgba(0,0,0,0.7)]"
          >
            <div className="h-32 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200" />
            <h3 className="pt-5 text-lg font-semibold text-gray-900">{t(`collections.${key}.title`)}</h3>
            <p className="text-sm text-gray-600">{t(`collections.${key}.description`)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

