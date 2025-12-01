'use client';

import { useState } from 'react';
import Image from 'next/image';

type Product = {
    id: string;
    title: string;
    description: string;
};

type Props = {
    products: Product[];
    itemsPerPage?: number;
};

export default function ProductCarousel({ products, itemsPerPage = 5 }: Props) {
    const [currentPage, setCurrentPage] = useState(0);
    const totalPages = Math.ceil(products.length / itemsPerPage);

    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProducts = products.slice(startIndex, endIndex);

    const handlePrevious = () => {
        setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
    };

    const handleNext = () => {
        setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
    };

    const canGoPrevious = currentPage > 0;
    const canGoNext = currentPage < totalPages - 1;

    return (
        <div className="relative">
            {/* 左划按钮 */}
            <button
                onClick={handlePrevious}
                disabled={!canGoPrevious && totalPages <= 1}
                className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border border-black/10 shadow-lg flex items-center justify-center transition-all duration-200 hover:bg-gray-50 hover:shadow-xl ${!canGoPrevious && totalPages <= 1
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:scale-110'
                    }`}
                aria-label="Previous products"
            >
                <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                    />
                </svg>
            </button>

            {/* 产品网格 - 响应式：移动端1列，平板2列，桌面5列 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 px-4 sm:px-8">
                {currentProducts.map((product) => (
                    <article
                        key={product.id}
                        className="group rounded-3xl border border-black/10 bg-white/60 p-6 shadow-[0_15px_45px_-35px_rgba(0,0,0,0.7)] transition hover:shadow-[0_20px_50px_-35px_rgba(0,0,0,0.8)]"
                    >
                        <div className="h-48 rounded-2xl bg-gradient-to-br bg-white transition group-hover:scale-105" >
                            <img
                                src={`/images/${product.id}/image.png`}
                                alt={`${product.title}`}
                                // fill       // 让图片自动填满父 div
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <h3 className="pt-5 text-lg font-semibold text-gray-900 line-clamp-2">
                            {product.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mt-2">
                            {product.description}
                        </p>
                    </article>
                ))}
            </div>

            {/* 右划按钮 */}
            <button
                onClick={handleNext}
                disabled={!canGoNext && totalPages <= 1}
                className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-4 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border border-black/10 shadow-lg flex items-center justify-center transition-all duration-200 hover:bg-gray-50 hover:shadow-xl ${!canGoNext && totalPages <= 1
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:scale-110'
                    }`}
                aria-label="Next products"
            >
                <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                    />
                </svg>
            </button>

            {/* 页面指示器 */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                    {Array.from({ length: totalPages }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentPage(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-200 ${index === currentPage
                                ? 'bg-gray-900 w-6'
                                : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                            aria-label={`Go to page ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

