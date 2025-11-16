import UmkmFavoritCard from "./UmkmFavoritCard";
import "../../../style/UmkmFavorit.css";
import { useRef, useState } from 'react';
import carousel1 from '../../../assets/landing-carousell1.png';
import carousel2 from '../../../assets/landing-carousell2.jpg';
import carousel3 from '../../../assets/landing-carousell3.jpg';
import carousel4 from '../../../assets/landing-carousell4.jpg';
import carousel5 from '../../../assets/landing-carousell5.jpg';
import carousel6 from '../../../assets/landing-carousell6.jpg';
import carousel7 from '../../../assets/landing-carousell7.jpg';
import carousel8 from '../../../assets/landing-carousell8.jpg';

// --- DEFINISI TIPE DAN DATA ---

interface UmkmData {
    id: number;
    name: string;
    category: string;
    icon: string;
    imageUrl: string;
}

// (Pastikan semua path impor ini benar)

// --- DEFINISI TIPE DAN DATA ---
// ... interface UmkmData ...

const umkmDataList: UmkmData[] = [
    { id: 1, name: "Pecel lele Bu Ayu", category: "Makanan", icon: "fa-solid fa-utensils", imageUrl: carousel1 }, // 👈 Gunakan variabel impor
    { id: 2, name: "Soto Ayam Pak Sadi", category: "Makanan", icon: "fa-solid fa-bowl-food", imageUrl: carousel2 }, // 👈 Gunakan variabel impor
    { id: 3, name: "Nasi Goreng Gila", category: "Makanan", icon: "fa-solid fa-utensils", imageUrl: carousel3 },
    { id: 4, name: "Bakso Rudal Jaya", category: "Makanan", icon: "fa-solid fa-bowl-food", imageUrl: carousel4 },
    { id: 5, name: "Mie Ayam Legenda", category: "Makanan", icon: "fa-solid fa-utensils", imageUrl: carousel5 },
    { id: 6, name: "Gado-Gado Ibu", category: "Makanan", icon: "fa-solid fa-bowl-food", imageUrl: carousel6 },
    { id: 7, name: "Sate Madura", category: "Makanan", icon: "fa-solid fa-utensils", imageUrl: carousel7 }, // Menggunakan kembali gambar 1
    { id: 8, name: "Es Teh Nusantara", category: "Minuman", icon: "fa-solid fa-mug-hot", imageUrl: carousel8 }, // Menggunakan kembali gambar 2
];

const DEFAULT_ACTIVE_ID = umkmDataList[0].id;

function UmkmFavorit() {
    const [activeCardId, setActiveCardId] = useState<number>(DEFAULT_ACTIVE_ID);

    // Dapatkan indeks dari kartu yang sedang aktif
    const activeIndex = umkmDataList.findIndex(umkm => umkm.id === activeCardId);

    // (Logika scrolling tetap sama)
    const carouselRef = useRef<HTMLDivElement>(null);
    const scrollAmount = 300;

    // Handler untuk hover
    const handleCardHover = (id: number) => {
        setActiveCardId(id);
    };

    // Handler untuk mouse leave (kembali ke kartu pertama)
    const handleCardLeave = () => {
        setActiveCardId(DEFAULT_ACTIVE_ID);
    };

    // --- LOGIKA NEXT YANG BARU ---
    const handleNext = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollLeft += scrollAmount; // 1. Scroll tampilan

            // 2. Tentukan ID kartu berikutnya
            const nextIndex = (activeIndex + 1) % umkmDataList.length; // Loop kembali ke awal jika sudah di akhir
            const nextCardId = umkmDataList[nextIndex].id;

            setActiveCardId(nextCardId); // 3. Pindahkan status ON ke kartu berikutnya
        }
    };

    // --- LOGIKA PREV YANG BARU ---
    const handlePrev = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollLeft -= scrollAmount; // 1. Scroll tampilan

            // 2. Tentukan ID kartu sebelumnya
            let prevIndex = activeIndex - 1;
            if (prevIndex < 0) {
                prevIndex = umkmDataList.length - 1; // Loop kembali ke akhir jika sudah di awal
            }
            const prevCardId = umkmDataList[prevIndex].id;

            setActiveCardId(prevCardId); // 3. Pindahkan status ON ke kartu sebelumnya
        }
    };

    return (
        <>
            <section className="umkm-favorit">
                <div className="umkm-favorit__header">
                    <h1>Penuh dengan UMKM Terbaik!</h1>
                    <p>Inilah daftar usaha yang paling diminati dan direkomendasikan oleh pelanggan di sekitar Anda.</p>
                </div>
                <div className="outer">
                    <div className="umkm-favorit__carousell" ref={carouselRef}>
                        {umkmDataList.map((umkm) => (
                            <UmkmFavoritCard
                                key={umkm.id}
                                data={umkm}
                                activeId={activeCardId}
                                onMouseEnter={() => handleCardHover(umkm.id)}
                                onMouseLeave={handleCardLeave}
                            />
                        ))}
                    </div>
                </div>
                <div className="umkm-favorit__button">
                    <button className="carousel-btn btn-prev" onClick={handlePrev}>
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>
                    <button className="carousel-btn btn-next" onClick={handleNext}>
                        <i className="fa-solid fa-chevron-right"></i>
                    </button>
                </div>
            </section>
        </>
    )
}

export default UmkmFavorit;