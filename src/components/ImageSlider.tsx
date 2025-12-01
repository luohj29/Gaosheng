'use client';

import {useEffect, useState} from 'react';

type Props = {
  images: string[];       // 图片 URL 列表
  interval?: number;      // 每张图显示的时长（毫秒）
  width?: string;         // 可选，容器宽度
  height?: string;        // 可选，容器高度
};

export default function ImageSlider({
  images,
  interval = 3000,
  width = "100%",
  height = "400px"
}: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <div
      style={{ width, height }}
      className="relative overflow-hidden rounded-xl"
    >
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`slide-${i}`}
          className={`
            absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000
            ${i === index ? "opacity-100" : "opacity-0"}
          `}
        />
      ))}
    </div>
  );
}
