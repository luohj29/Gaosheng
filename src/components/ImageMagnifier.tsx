'use client';

import { useState, useRef, MouseEvent } from 'react';
import Image from 'next/image';

type Props = {
  src: string;
  alt: string;
};

export default function ImageMagnifier({ src, alt }: Props) {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement>(null);
  
  // Magnifier settings
  const magnifierSize = 150; // Size of the magnifier box (px)
  const zoomLevel = 2.5; // Zoom level

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!imgRef.current) return;

    const { top, left, width, height } = imgRef.current.getBoundingClientRect();
    const x = e.pageX - left - window.scrollX;
    const y = e.pageY - top - window.scrollY;

    // Update magnifier position
    setMagnifierPosition({ x, y });

    // Check if cursor is inside image bounds
    if (x < 0 || y < 0 || x > width || y > height) {
      setShowMagnifier(false);
    } else {
      setShowMagnifier(true);
    }
  };

  return (
    <div 
      className="relative h-full w-full overflow-hidden cursor-crosshair"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setShowMagnifier(true)}
      onMouseLeave={() => setShowMagnifier(false)}
    >
      <Image
        ref={imgRef}
        src={src}
        alt={alt}
        fill
        className="object-contain p-4"
        priority
      />

      {showMagnifier && (
        <div
          style={{
            position: 'absolute',
            pointerEvents: 'none',
            height: `${magnifierSize}px`,
            width: `${magnifierSize}px`,
            top: `${magnifierPosition.y - magnifierSize / 2}px`,
            left: `${magnifierPosition.x - magnifierSize / 2}px`,
            opacity: 1,
            border: '1px solid lightgray',
            backgroundColor: 'white',
            backgroundImage: `url('${src}')`,
            backgroundRepeat: 'no-repeat',
            // Calculate background position to match zoom
            backgroundSize: `${imgRef.current?.width! * zoomLevel}px ${imgRef.current?.height! * zoomLevel}px`,
            backgroundPositionX: `${-magnifierPosition.x * zoomLevel + magnifierSize / 2}px`,
            backgroundPositionY: `${-magnifierPosition.y * zoomLevel + magnifierSize / 2}px`,
            borderRadius: '50%', // Circular magnifier
            boxShadow: '0 0 10px rgba(0,0,0,0.2)',
            zIndex: 50
          }}
        />
      )}
    </div>
  );
}

