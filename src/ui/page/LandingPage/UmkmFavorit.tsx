import UmkmFavoritCard from "./UmkmFavoritCard";
import "../../../style/UmkmFavorit.css";
import { useRef } from 'react'; // 1. Import useRef

function UmkmFavorit() {
    // 2. Buat ref untuk container carousel
    const carouselRef = useRef<HTMLDivElement>(null);

    const scrollAmount = 300; 

    // 3. Buat fungsi untuk handle klik
    const handlePrev = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollLeft -= scrollAmount;
        }
    };

    const handleNext = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollLeft += scrollAmount;
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
                    {/* 4. Lampirkan ref ke elemen carousel */}
                    <div className="umkm-favorit__carousell" ref={carouselRef}> 
                        <UmkmFavoritCard isOff={false} />
                        <UmkmFavoritCard isOff={true} />
                        <UmkmFavoritCard isOff={true} />
                        <UmkmFavoritCard isOff={true} />
                        <UmkmFavoritCard isOff={true} />
                        <UmkmFavoritCard isOff={true} />
                        <UmkmFavoritCard isOff={true} />
                        <UmkmFavoritCard isOff={true} />
                        <UmkmFavoritCard isOff={true} />
                    </div>
                </div>
                <div className="umkm-favorit__button">
                    {/* 5. Tambahkan onClick ke tombol */}
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