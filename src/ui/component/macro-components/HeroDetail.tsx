import { useState, useCallback } from "react";
import "../../../style/HeroDetail.css";

type HeroDetailProps = {
    images: string[];
};

function HeroDetail({ images }: HeroDetailProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStartX, setTouchStartX] = useState<number | null>(null);

    const nextSlide = useCallback(() => {
        if (currentIndex < images.length - 1) {
            setCurrentIndex((prevIndex) => prevIndex + 1);
        }
    }, [currentIndex, images.length]);

    const prevSlide = useCallback(() => {
        if (currentIndex > 0) {
            setCurrentIndex((prevIndex) => prevIndex - 1);
        }
    }, [currentIndex]);

    // Swipe gesture
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStartX(e.touches[0].clientX);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX === null) return;
        const touchEndX = e.changedTouches[0].clientX;
        const distance = touchStartX - touchEndX;

        if (distance > 50) nextSlide();
        if (distance < -50) prevSlide();

        setTouchStartX(null);
    };

    return (
        <section className="hero-detail-container">
            <div
                className="hero-slider"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                {images.map((img, index) => (
                    <img
                        key={index}
                        src={img}
                        alt={`slide-${index}`}
                        className={`hero-image ${index === currentIndex ? "active" : "inactive"
                            }`}
                    />
                ))}

                {/* Tombol Prev & Next */}
                <button
                    className="nav-btn prev-btn"
                    onClick={prevSlide}
                    disabled={currentIndex === 0}
                    aria-label="Previous slide"
                >
                    ❮
                </button>

                <button
                    className="nav-btn next-btn"
                    onClick={nextSlide}
                    disabled={currentIndex === images.length - 1}
                    aria-label="Next slide"
                >
                    ❯
                </button>

                {/* Indicator */}
                <div className="indicator-container">
                    {images.map((_, index) => (
                        <div
                            key={index}
                            className={`indicator-dot ${index === currentIndex ? "active" : ""
                                }`}
                            onClick={() => setCurrentIndex(index)}
                        ></div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default HeroDetail;
