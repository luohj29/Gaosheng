import {getTranslations} from 'next-intl/server';

type Props = {
  locale: string;
};

export default async function JournalSection({locale}: Props) {
  const t = await getTranslations({locale, namespace: 'HomePage'});
  const journalEntryKeys: Array<'artisanry' | 'materials'> = ['artisanry', 'materials'];

  return (
    <section id="journal" className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-400">
          {t('journalHeading')}
        </p>
        <p className="text-gray-600">{t('journalDescription')}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {journalEntryKeys.map((key) => (
          <article key={key} className="rounded-3xl border border-black/10 bg-white/80 p-6">
            <div className="h-48 rounded-2xl bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300" />
            <h3 className="pt-5 text-xl font-semibold text-gray-900">
              {t(`journalEntries.${key}.title`)}
            </h3>
            <p className="text-sm text-gray-600">{t(`journalEntries.${key}.excerpt`)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

