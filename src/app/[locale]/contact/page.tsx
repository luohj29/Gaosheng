import {getTranslations} from 'next-intl/server';
import ContactForm from '@/src/components/ContactForm';
import Image from 'next/image';

type Props = {
  params: Promise<{locale: string}>;
};

// 硬编码的联系信息
const CONTACT_INFO = {
  phone: '00852-53008243',
  phone2: '+86-13702827856',
  email: 'officefurniture1@gaoshenghk.com',
  address: 'Room 4, 16/f, Ho King Commercial Centre, 2-16 Fayuen Street, Mongkok Kowloon, Hong Kong',
  wechatQR: '/contact/wechat.webp',
  whatsappQR: '/contact/whatsapp.webp',
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
          {/* <div className="space-y-4">
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
          </div> */}

          {/* 联系信息部分 */}
          <div className="mt-8 space-y-4 rounded-3xl border border-black/10 bg-white/70 p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900">{t('contactInfoHeading') || 'Contact Information'}</h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400 mb-2">Phone</p>
                <p className="text-sm font-semibold text-gray-900">{CONTACT_INFO.phone}</p>
                <p className="text-sm font-semibold text-gray-900">{CONTACT_INFO.phone2}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400 mb-2">Email</p>
                <a href={`mailto:${CONTACT_INFO.email}`} className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                  {CONTACT_INFO.email}
                </a>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400 mb-2">Address</p>
                <p className="text-sm text-gray-900">{CONTACT_INFO.address}</p>
              </div>
              <div className="flex gap-4 pt-2">
                <div className="flex flex-col items-center gap-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">WeChat</p>
                  <div className="relative w-24 h-24 bg-white rounded-lg p-2 border border-gray-200">
                    <Image
                      src={CONTACT_INFO.wechatQR}
                      alt="WeChat QR Code"
                      fill
                      className="object-contain rounded"
                    />
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">WhatsApp</p>
                  <div className="relative w-24 h-24 bg-white rounded-lg p-2 border border-gray-200">
                    <Image
                      src={CONTACT_INFO.whatsappQR}
                      alt="WhatsApp QR Code"
                      fill
                      className="object-contain rounded"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border border-black/10 bg-white/80 p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900">{t('formHeading')}</h2>
          <p className="text-sm text-gray-600">{t('formDescription')}</p>
          <ContactForm />
        </div>
      </section>
    </div>
  );
}


