// src/component/macro-components/HeroDetail.tsx
import { useState, useCallback, useEffect } from "react";
import "../../../style/HeroDetail.css";
import HeroImage from '../../../assets/card-image.png'; // Fallback

// 1. Tentukan props yang diterima
interface HeroDetailProps {
    mainImage: string;
    gallery: string[];
}

function HeroDetail({ mainImage, gallery }: HeroDetailProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStartX, setTouchStartX] = useState<number | null>(null);

    // 2. Gabungkan gambar utama dan galeri menjadi satu array
    // Gunakan 'Set' untuk menghindari duplikasi jika gambar utama ada di galeri
    const images = Array.from(new Set([mainImage, ...gallery].filter(Boolean))); // filter(Boolean) untuk hapus string kosong/null

    // Jika tidak ada gambar sama sekali, gunakan fallback
    if (images.length === 0) {
        images.push(HeroImage);
    }

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

    // 3. Reset index jika gambar berubah (misal: data baru di-load)
    useEffect(() => {
        setCurrentIndex(0);
    }, [mainImage]); // Reset saat gambar utama berubah

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
                {/* 4. Render gambar dari array dinamis */}
                {images.map((img, index) => (
                    <img
                        key={index}
                        src={img}
                        alt={`slide-${index}`}
                        className={`hero-image ${index === currentIndex ? "active" : "inactive"}`}
                    />
                ))}

                {/* Tombol Prev & Next (hanya tampil jika gambar > 1) */}
                {images.length > 1 && (
                    <>
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

                        {/* Indicator (hanya tampil jika gambar > 1) */}
                        <div className="indicator-container">
                            {images.map((_, index) => (
                                <div
                                    key={index}
                                    className={`indicator-dot ${index === currentIndex ? "active" : ""}`}
                                    onClick={() => setCurrentIndex(index)}
                                ></div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}

export default HeroDetail;