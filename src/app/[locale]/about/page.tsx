import { getTranslations } from "next-intl/server";
import Image from "next/image";
import "@/public/css/color.css";
import { locales } from '@/src/i18n/config';

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function AboutUs(props: Props) {
  const params = await props.params;
  const { locale } = params;

  const t = await getTranslations({ locale, namespace: "AboutPage" });

  // Keys for timeline items
  const timelineKeys = ['item1', 'item2', 'item3', 'item4'];
  // Keys for certifications
  const certKeys = ['c1', 'c2', 'c3', 'c4'];

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-16" >
      {/* Hero Section */}
      <section className="relative w-full h-[400px] flex items-center justify-center text-white overflow-hidden rounded-3xl shadow-2xl">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={t("hero.image")}
            alt={t("hero.title")}
            fill
            className="object-cover"
            priority
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl px-6 space-y-6">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight drop-shadow-lg">
            {t("hero.title")}
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl font-light max-w-2xl mx-auto drop-shadow-md">
            {t("hero.subtitle")}
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="w-full bg-white">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6 order-2 md:order-1">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 relative pb-4">
              <span className="relative">
                {t("intro.title")}
                <span className="absolute bottom-0 left-0 w-20 h-1 bg-gradient-to-r from-blue-600 to-blue-400"></span>
              </span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t("intro.description")}
            </p>
          </div>
          <div className="relative h-[400px] md:h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl order-1 md:order-2 group">
            <Image
              src={t("intro.image")}
              alt={t("intro.title")}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-br bg-color py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="p-6 md:p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow text-center">
              <span className="block text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r bg-color bg-clip-text text-transparent mb-3">
                {t("stats.founded")}
              </span>
              <span className="text-xs md:text-sm uppercase tracking-widest text-gray-600 font-medium">
                {t("stats.foundedLabel")}
              </span>
            </div>
            <div className="p-6 md:p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow text-center">
              <span className="block text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r bg-color bg-clip-text text-transparent mb-3">
                {t("stats.years")}
              </span>
              <span className="text-xs md:text-sm uppercase tracking-widest text-gray-600 font-medium">
                {t("stats.yearsLabel")}
              </span>
            </div>
            <div className="p-6 md:p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow text-center">
              <span className="block text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r bg-color bg-clip-text text-transparent mb-3">
                {t("stats.area")}
              </span>
              <span className="text-xs md:text-sm uppercase tracking-widest text-gray-600 font-medium">
                {t("stats.areaLabel")}
              </span>
            </div>
            <div className="p-6 md:p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow text-center">
              <span className="block text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r bg-color bg-clip-text text-transparent mb-3">
                {t("stats.employees")}
              </span>
              <span className="text-xs md:text-sm uppercase tracking-widest text-gray-600 font-medium">
                {t("stats.employeesLabel")}
              </span>
            </div>
          </div>
        </div>
      </section>
      {/* Certification Section */}
      <section className="w-full bg-white">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6 order-2 md:order-1">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 relative pb-4">
              <span className="relative">
                {t("certification.title")}
                <span className="absolute bottom-0 left-0 w-20 h-1 bg-gradient-to-r from-blue-600 to-blue-400"></span>
              </span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t("certification.description")}
            </p>
          </div>
          <div className="relative h-[400px] md:h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl group bg-gray-100">
            <Image
              src={t("certification.image")}
              alt={t("certification.title")}
              fill
              className="object-contain transition-transform duration-700 group-hover:scale-110"
            />
          </div>
        </div>
      </section>

      {/*Global service Section */}
      <section className="w-full bg-white">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6 order-2 md:order-1">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 relative pb-4">
              <span className="relative">
                {t("globalService.title")}
                <span className="absolute bottom-0 left-0 w-20 h-1 bg-gradient-to-r from-blue-600 to-blue-400"></span>
              </span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t("globalService.description")}
            </p>
          </div>
          <div className="relative h-[400px] md:h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl order-1 md:order-2 group bg-gray-100  ">
            <Image
              src={t("globalService.image")}
              alt={t("globalService.title")}
              fill
              className="object-contain transition-transform duration-700 group-hover:scale-110"
            />
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="w-full bg-white">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="relative h-[400px] md:h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl group">
            <Image
              src={t("vision.image")}
              alt={t("vision.title")}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 relative pb-4">
              <span className="relative">
                {t("vision.title")}
                <span className="absolute bottom-0 left-0 w-20 h-1 bg-gradient-to-r from-blue-600 to-blue-400"></span>
              </span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t("vision.description")}
            </p>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 md:mb-20">
            <span className="relative inline-block">
              {t("timeline.title")}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-400 mt-2"></span>
            </span>
          </h2>
          <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
            {timelineKeys.map((key, index) => (
              <div key={key} className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group`}>
                {/* Dot */}
                <div className="absolute left-0 md:left-1/2 w-10 h-10 bg-white border-4 border-color rounded-full -translate-x-1/2 md:-translate-x-1/2 flex items-center justify-center z-10 shadow-sm group-hover:scale-110 transition-transform">
                  <div className="w-3 h-3 bg-color rounded-full"></div>
                </div>

                {/* Content */}
                <div className={`ml-12 md:ml-0 md:w-[45%] ${index % 2 === 0 ? 'md:mr-auto md:text-right md:pr-12' : 'md:ml-auto md:pl-12'}`}>
                  <span className="inline-block px-3 py-1 mb-2 text-xs font-semibold tracking-wider text-white uppercase bg-color rounded-full">
                    {t(`timeline.items.${key}.year`)}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{t(`timeline.items.${key}.title`)}</h3>
                  <p className="text-gray-600">{t(`timeline.items.${key}.description`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      {/* <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 md:mb-16">
            <span className="relative inline-block">
              {t("certifications.title")}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-400 to-blue-600 mt-2"></span>
            </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {certKeys.map((key) => (
              <div key={key} className="p-8 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 shadow-lg">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-full mx-auto mb-6 flex items-center justify-center border border-white/20">
                  <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <p className="text-base md:text-lg font-medium">{t(`certifications.items.${key}`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}
    </div>
  );
}
