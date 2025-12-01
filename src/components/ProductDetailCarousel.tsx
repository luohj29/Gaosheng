'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import ImageMagnifier from './ImageMagnifier';

type Props = {
  images: string[];
};

export default function ProductDetailCarousel({ images }: Props) {
  const [selectedImage, setSelectedImage] = useState<string>('');
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Initialize state
  useEffect(() => {
    if (images && images.length > 0) {
      setSelectedImage(images[0]);
    }
  }, [images]);

  const handleThumbnailClick = (img: string) => {
    setSelectedImage(img);
  };

  const scrollThumbnails = (direction: 'left' | 'right') => {
    const container = thumbnailsRef.current;
    if (!container) return;
    const scrollAmount = 200;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const container = thumbnailsRef.current;
    if (!container) return;

    const updateScrollButtons = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    };

    updateScrollButtons();
    container.addEventListener('scroll', updateScrollButtons);
    window.addEventListener('resize', updateScrollButtons);

    return () => {
      container.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, [images]);

  if (!images || images.length === 0) return null;

  return (
    <div className="flex flex-col gap-6">
      {/* Main Image with Magnifier */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-100 border border-gray-200 z-10">
        <ImageMagnifier src={selectedImage || images[0]} alt="Product Main View" />
      </div>

      {/* Thumbnails Gallery */}
      {images.length > 1 && (
        <div className="relative">
          <div
            ref={thumbnailsRef}
            className="flex gap-3 overflow-x-auto pb-2 scroll-smooth scrollbar-hide"
          >
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => handleThumbnailClick(img)}
                className={`relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                  selectedImage === img
                    ? 'border-blue-600 opacity-100'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </button>
            ))}
          </div>

          {/* Scroll Controls */}
          {canScrollLeft && (
            <button
              type="button"
              aria-label="Scroll thumbnails left"
              onClick={(e) => {
                e.stopPropagation();
                scrollThumbnails('left');
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 rounded-full border border-gray-200 bg-white p-2 shadow-lg hover:bg-gray-50 transition-all pointer-events-auto"
            >
              <span className="sr-only">Scroll left</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </button>
          )}

          {canScrollRight && (
            <button
              type="button"
              aria-label="Scroll thumbnails right"
              onClick={(e) => {
                e.stopPropagation();
                scrollThumbnails('right');
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 rounded-full border border-gray-200 bg-white p-2 shadow-lg hover:bg-gray-50 transition-all pointer-events-auto"
            >
              <span className="sr-only">Scroll right</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
