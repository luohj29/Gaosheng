import {getTranslations} from 'next-intl/server';

type Props = {
  params: Promise<{locale: string}>;
};

const channelKeys = ['consultation', 'showroom', 'partnership'] as const;

export default async function ContactPage({params}: Props) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'ContactPage'});

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-20">
      <section className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-gray-400">
          {t('heroEyebrow')}
        </p>
        <h1 className="text-3xl font-semibold text-gray-900 md:text-4xl">{t('heroTitle')}</h1>
        <p className="text-lg text-gray-600">{t('heroBody')}</p>
      </section>

      <section className="grid gap-10 md:grid-cols-2">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">{t('channelsHeading')}</h2>
          <div className="space-y-4">
            {channelKeys.map((key) => (
              <article key={key} className="rounded-3xl border border-black/10 bg-white/70 p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">
                  {t(`channels.${key}.tagline`)}
                </p>
                <h3 className="pt-2 text-xl font-semibold text-gray-900">{t(`channels.${key}.title`)}</h3>
                <p className="text-sm text-gray-600">{t(`channels.${key}.description`)}</p>
                <p className="pt-3 text-sm font-semibold text-gray-900">{t(`channels.${key}.detail`)}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border border-black/10 bg-white/80 p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900">{t('formHeading')}</h2>
          <p className="text-sm text-gray-600">{t('formDescription')}</p>
          <form className="space-y-4">
            <label className="block space-y-1 text-sm text-gray-600">
              <span>{t('formFields.name')}</span>
              <input
                type="text"
                className="w-full rounded-2xl border border-black/10 px-4 py-3 text-gray-900 focus:border-gray-900 focus:outline-none"
                placeholder={t('formFields.namePlaceholder')}
              />
            </label>
            <label className="block space-y-1 text-sm text-gray-600">
              <span>{t('formFields.email')}</span>
              <input
                type="email"
                className="w-full rounded-2xl border border-black/10 px-4 py-3 text-gray-900 focus:border-gray-900 focus:outline-none"
                placeholder={t('formFields.emailPlaceholder')}
              />
            </label>
            <label className="block space-y-1 text-sm text-gray-600">
              <span>{t('formFields.message')}</span>
              <textarea
                rows={4}
                className="w-full rounded-2xl border border-black/10 px-4 py-3 text-gray-900 focus:border-gray-900 focus:outline-none"
                placeholder={t('formFields.messagePlaceholder')}
              />
            </label>
            <button
              type="button"
              className="w-full rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-700"
            >
              {t('formSubmit')}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}


