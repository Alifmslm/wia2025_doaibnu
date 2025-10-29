import { useState, useCallback } from "react";
import "../../../style/HeroDetail.css";

type HeroDetailProps = {
    images: string[];
};

function HeroDetail({ images }: HeroDetailProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStartX, setTouchStartX] = useState<number | null>(null);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    }, [images.length]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    }, [images.length]);

    // Swipe handling
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStartX(e.touches[0].clientX);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX === null) return;
        const touchEndX = e.changedTouches[0].clientX;
        const distance = touchStartX - touchEndX;

        if (distance > 50) nextSlide(); // geser kiri
        if (distance < -50) prevSlide(); // geser kanan

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
                        className={`hero-image ${index === currentIndex ? "active" : "inactive"}`}
                    />
                ))}

                {/* Indicator di atas gambar */}
                <div className="indicator-container">
                    {images.map((_, index) => (
                        <div
                            key={index}
                            className={`indicator-dot ${index === currentIndex ? "active" : ""}`}
                            onClick={() => setCurrentIndex(index)}
                        ></div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default HeroDetail;
