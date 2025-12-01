import CollectionsSection from '@/src/components/CollectionsSection';
import HeroSection from '@/src/components/HeroSection';
import JournalSection from '@/src/components/JournalSection';
import StudioSection from '@/src/components/StudioSection';
import CompanyProfile from '@/src/components/CompanyProfile';
import ProductsShow from '@/src/components/ProductsShow';
import FollowUs from '@/src/components/FollowUs';
import ProjectShow from '@/src/components/ProjectShow';
import News from '@/src/components/News';
import BrandCarousel from '@/src/components/BrandCarousel';

type Props = {
  params: Promise<{locale: string}>;
};

export default async function HomePage({params}: Props) {
  const {locale} = await params;
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-16">
      <HeroSection locale={locale} />
      <CompanyProfile locale={locale} />
      <BrandCarousel />
      <ProductsShow locale={locale} />
      {/* <StudioSection locale={locale} /> */}
      <ProjectShow locale={locale} />
      <News locale={locale} />
      {/* <FollowUs locale={locale} /> */}
      {/* <CollectionsSection locale={locale} /> */}
      {/* <JournalSection locale={locale} /> */}
    </div>
  );
}