import { useState, useEffect, useCallback } from "react";

export default function ImageSlider({ images, showThumbnails = true, autoPlay = true, interval = 5000 }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
    const [progress, setProgress] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [touchStart, setTouchStart] = useState(null);

    // Auto-slide with progress bar
    useEffect(() => {
        if (!images || images.length <= 1 || isHovered || !autoPlay || isFullscreen) {
            setProgress(0);
            return;
        }

        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
                    return 0;
                }
                return prev + (100 / (interval / 50));
            });
        }, 50);

        return () => clearInterval(progressInterval);
    }, [images, isHovered, autoPlay, interval, isFullscreen, currentIndex]);

    const goToPrevious = useCallback(() => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setProgress(0);
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
        setTimeout(() => setIsTransitioning(false), 500);
    }, [images?.length, isTransitioning]);

    const goToNext = useCallback(() => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setProgress(0);
        setCurrentIndex((prev) => (prev + 1) % images.length);
        setTimeout(() => setIsTransitioning(false), 500);
    }, [images?.length, isTransitioning]);

    const goToSlide = (index) => {
        if (index === currentIndex || isTransitioning) return;
        setIsTransitioning(true);
        setProgress(0);
        setCurrentIndex(index);
        setTimeout(() => setIsTransitioning(false), 500);
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (isFullscreen) {
                if (e.key === 'ArrowLeft') goToPrevious();
                if (e.key === 'ArrowRight') goToNext();
                if (e.key === 'Escape') setIsFullscreen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFullscreen, goToPrevious, goToNext]);

    // Touch handlers for swipe
    const handleTouchStart = (e) => {
        setTouchStart(e.touches[0].clientX);
    };

    const handleTouchEnd = (e) => {
        if (!touchStart) return;
        const touchEnd = e.changedTouches[0].clientX;
        const diff = touchStart - touchEnd;
        if (Math.abs(diff) > 50) {
            if (diff > 0) goToNext();
            else goToPrevious();
        }
        setTouchStart(null);
    };

    // Zoom handlers
    const handleMouseMove = (e) => {
        if (!isZoomed) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setZoomPosition({ x, y });
    };

    const toggleZoom = () => {
        setIsZoomed(!isZoomed);
    };

    // Fullscreen component
    const FullscreenView = () => (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center">
            {/* Close button */}
            <button
                onClick={() => setIsFullscreen(false)}
                className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all z-50"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            {/* Image counter */}
            <div className="absolute top-6 left-6 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white font-medium">
                {currentIndex + 1} / {images.length}
            </div>

            {/* Main image */}
            <div className="relative w-full h-full flex items-center justify-center p-8">
                <img
                    src={images[currentIndex]}
                    alt={`Slide ${currentIndex + 1}`}
                    className="max-w-full max-h-full object-contain transition-transform duration-500"
                />

                {/* Navigation arrows */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={goToPrevious}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all hover:scale-110"
                        >
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={goToNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all hover:scale-110"
                        >
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </>
                )}
            </div>

            {/* Thumbnails */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 p-2 rounded-2xl bg-white/10 backdrop-blur-sm max-w-[90%] overflow-x-auto">
                {images.map((img, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all ${
                            index === currentIndex ? 'ring-2 ring-white scale-105' : 'opacity-50 hover:opacity-100'
                        }`}
                    >
                        <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                ))}
            </div>
        </div>
    );

    if (!images || images.length === 0) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl">
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <span className="text-gray-500 font-medium">No images available</span>
            </div>
        );
    }

    return (
        <>
            {isFullscreen && <FullscreenView />}
            
            <div 
                className="relative w-full h-full group"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => { setIsHovered(false); setIsZoomed(false); }}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                {/* Progress Bar */}
                {images.length > 1 && autoPlay && !isHovered && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-black/20 z-20 rounded-t-xl overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-100 ease-linear"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                )}

                {/* Images Container */}
                <div 
                    className={`w-full h-full overflow-hidden relative rounded-xl ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                    onClick={toggleZoom}
                    onMouseMove={handleMouseMove}
                >
                    {images.map((imgSrc, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-all duration-700 ease-out ${
                                index === currentIndex 
                                    ? 'opacity-100 translate-x-0 scale-100' 
                                    : index < currentIndex 
                                        ? 'opacity-0 -translate-x-full scale-95'
                                        : 'opacity-0 translate-x-full scale-95'
                            }`}
                        >
                            <img
                                src={imgSrc}
                                alt={`Slide ${index + 1}`}
                                className={`w-full h-full transition-transform duration-300 ${
                                    isZoomed && index === currentIndex 
                                        ? 'scale-[2.5] object-cover' 
                                        : 'scale-100 object-cover'
                                }`}
                                style={isZoomed && index === currentIndex ? {
                                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                                } : {}}
                                draggable="false"
                            />
                            {/* Gradient Overlay */}
                            {!isZoomed && (
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
                            )}
                        </div>
                    ))}
                </div>

                {/* Control Panel - Top Right */}
                <div className="absolute top-3 left-3 z-20 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    {/* Fullscreen Button */}
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsFullscreen(true); }}
                        className="w-9 h-9 rounded-lg bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-all hover:scale-105"
                        title="Fullscreen"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                    </button>
                    
                    {/* Zoom indicator */}
                    <div className="px-2 py-1 rounded-lg bg-black/40 backdrop-blur-sm text-white text-xs font-medium">
                        {isZoomed ? '🔍 Zoomed' : 'Click to zoom'}
                    </div>
                </div>

                {/* Image Counter Badge */}
                {images.length > 1 && (
                    <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
                        <div className="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-white text-sm font-semibold flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{currentIndex + 1} / {images.length}</span>
                        </div>
                    </div>
                )}

                {/* Navigation Arrows */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm shadow-xl flex items-center justify-center text-gray-800 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 hover:shadow-2xl focus:outline-none active:scale-95"
                            aria-label="Previous image"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        <button
                            onClick={(e) => { e.stopPropagation(); goToNext(); }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm shadow-xl flex items-center justify-center text-gray-800 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 hover:shadow-2xl focus:outline-none active:scale-95"
                            aria-label="Next image"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </>
                )}

                {/* Modern Dot Indicators with Animation */}
                {images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-2 rounded-full bg-black/30 backdrop-blur-md">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={(e) => { e.stopPropagation(); goToSlide(index); }}
                                className={`transition-all duration-500 rounded-full focus:outline-none ${
                                    index === currentIndex 
                                        ? 'w-8 h-2.5 bg-white shadow-lg' 
                                        : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70 hover:scale-125'
                                }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                )}

                {/* Thumbnail Strip */}
                {showThumbnails && images.length > 1 && (
                    <div className="absolute -bottom-20 left-0 right-0 flex justify-center gap-2 opacity-0 group-hover:opacity-100 group-hover:-bottom-16 transition-all duration-500">
                        {images.slice(0, 5).map((img, index) => (
                            <button
                                key={index}
                                onClick={(e) => { e.stopPropagation(); goToSlide(index); }}
                                className={`relative w-12 h-12 rounded-lg overflow-hidden transition-all duration-300 ${
                                    index === currentIndex 
                                        ? 'ring-2 ring-blue-500 ring-offset-2 scale-110 shadow-lg' 
                                        : 'opacity-60 hover:opacity-100 hover:scale-105'
                                }`}
                            >
                                <img 
                                    src={img} 
                                    alt={`Thumb ${index + 1}`} 
                                    className="w-full h-full object-cover"
                                />
                                {index === currentIndex && (
                                    <div className="absolute inset-0 bg-blue-500/20" />
                                )}
                            </button>
                        ))}
                        {images.length > 5 && (
                            <div className="w-12 h-12 rounded-lg bg-gray-800/80 backdrop-blur-sm flex items-center justify-center text-white text-xs font-bold">
                                +{images.length - 5}
                            </div>
                        )}
                    </div>
                )}

                {/* Play/Pause indicator */}
                {images.length > 1 && autoPlay && (
                    <div className={`absolute bottom-14 right-3 transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white text-xs font-medium flex items-center gap-1.5">
                            {isHovered ? (
                                <>
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                                    </svg>
                                    Paused
                                </>
                            ) : (
                                <>
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z"/>
                                    </svg>
                                    Playing
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}