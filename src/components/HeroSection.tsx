import { getTranslations } from 'next-intl/server';
import ImageSlider from '@/src/components/ImageSlider';

type Props = {
  locale: string;
};

export default async function HeroSection({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'HomePage' });
  const images = [
    "/images/home_first.png",
    "/images/home_second.png",
    "/images/home_third.png",
  ]

  return (
    <section >
      <div >
        <ImageSlider images={images} interval={4000}  />
      </div>
    </section>
  );
}

