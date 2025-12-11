import { getTranslations } from 'next-intl/server';
import ImageSlider from '@/src/components/ImageSlider';

type Props = {
  locale: string;
};

export default async function HeroSection({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'HomePage' });
  const images = [
    "/images/home_first.webp",
    "/images/home_second.webp",
    "/images/home_third.webp",
  ]

  return (
    <section >
      <div >
        <ImageSlider images={images} interval={4000}  />
      </div>
    </section>
  );
}

