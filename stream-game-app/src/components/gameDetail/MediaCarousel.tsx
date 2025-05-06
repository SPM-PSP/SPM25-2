'use client';

import { useState, useEffect } from 'react';

interface MediaCarouselProps {
    images: string[];
    video?: string;
    autoPlay?: boolean;
    interval?: number;
}

const MediaCarousel = ({ images, video, autoPlay = true, interval = 5000 }: MediaCarouselProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const mediaItems = video ? [...images, video] : [...images];

    const nextSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === mediaItems.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? mediaItems.length - 1 : prevIndex - 1
        );
    };

    useEffect(() => {
        if (!autoPlay) return;

        const timer = setInterval(() => {
            nextSlide();
        }, interval);

        return () => clearInterval(timer);
    }, [currentIndex, autoPlay, interval]);

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    return (
        <div className="relative w-full h-full overflow-hidden rounded-lg">
            <div
                className="flex transition-transform duration-500 ease-in-out h-full"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {mediaItems.map((item, index) => (
                    <div key={index} className="w-full flex-shrink-0 h-full">
                        {item.indexOf('.mp4') !=-1 ? (
                            <video
                                controls
                                className="w-full h-full object-cover"
                                autoPlay={currentIndex === index}
                                muted
                                loop
                            >
                                <source src={item} type="video/mp4" />
                            </video>
                        ) : (
                            <img
                                src={item}
                                alt={`Slide ${index}`}
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>
                ))}
            </div>

            {/* 导航箭头 */}
            <button
                onClick={prevSlide}
                className="absolute left-0 m-auto text-5xl inset-y-1/2 cursor-pointer text-gray-400 z-20"
                aria-label="Previous slide"
            >
                &lt;
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-0 m-auto text-5xl inset-y-1/2 cursor-pointer text-gray-400 z-20"
                aria-label="Next slide"
            >
                &gt;
            </button>

            {/* 指示器点 */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                {mediaItems.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full transition ${currentIndex === index ? 'bg-white' : 'bg-gray-400 bg-opacity-50'}`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default MediaCarousel;