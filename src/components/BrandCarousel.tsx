import Image from 'next/image';

const brands = [
    { name: 'brand1', logo: '/brand/brand1.webp' },
    { name: 'brand2', logo: '/brand/brand2.webp' },
    { name: 'brand3', logo: '/brand/brand3.webp' },
    { name: 'brand4', logo: '/brand/brand4.webp' },
    { name: 'brand5', logo: '/brand/brand5.webp' },
    { name: 'brand6', logo: '/brand/brand6.webp' },
    { name: 'brand7', logo: '/brand/brand7.webp' },
    { name: 'brand8', logo: '/brand/brand8.webp' },
    { name: 'brand9', logo: '/brand/brand9.webp' },
];

export default function BrandCarousel() {
    // Duplicate the array to ensure seamless looping
    const allBrands = [...brands, ...brands];

    return (
        <div className="w-full bg-white py-12">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <p className="text-center text-sm font-semibold leading-8 text-gray-500 uppercase tracking-widest mb-8">
                    Trusted by Global Partners
                </p>
                
                <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
                    {/* Gradient Masks for smooth fade effect */}
                    <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white to-transparent"></div>
                    <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white to-transparent"></div>

                    {/* Carousel Track */}
                    <div className="flex w-full animate-scroll items-center">
                        {allBrands.map((brand, index) => (
                            <div
                                key={`${brand.name}-${index}`}
                                className="flex flex-shrink-0 items-center justify-center px-8 md:px-12"
                            >
                                <div className="relative h-16 w-32 md:h-20 md:w-40 grayscale transition-all duration-300 hover:grayscale-0 hover:scale-110 opacity-60 hover:opacity-100">
                                    <Image
                                        src={brand.logo}
                                        alt={brand.name}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
