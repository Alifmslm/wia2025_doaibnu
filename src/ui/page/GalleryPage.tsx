import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/GalleryPage.css";
import CloseButton from "../../assets/close-button.png";
import GalleryImage1 from "../../assets/gallery-image-1.png";
import GalleryImage2 from "../../assets/gallery-image-2.png";
import GalleryImage3 from "../../assets/gallery-image-3.png";
import GalleryImage4 from "../../assets/gallery-image-4.png";

function GalleryPage() {
    const images = [GalleryImage1, GalleryImage2, GalleryImage3, GalleryImage4];
    const [selectedImage, setSelectedImage] = useState(images[0]);

    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1); // ini akan kembali ke halaman sebelumnya
    };

    return (
        <>
            <section className="gallery-page">
                {/* Tombol Close */}
                <nav className="icon-container">
                    <div className="icon-item">
                        <img src={CloseButton} alt="close-button" onClick={handleBack} />
                    </div>
                </nav>

                {/* Gambar utama */}
                <img src={selectedImage} alt="Main" className="img-main" />

                {/* Carousel bawah */}
                <section className="gallery-carousel">
                    <div className="carousel-header">
                        <h1>Soto Ayam Bu Carti</h1>
                        <h1>{images.indexOf(selectedImage) + 1}/{images.length}</h1>
                    </div>

                    <div className="carousell-list">
                        {images.map((img, index) => (
                            <div
                                key={index}
                                className={`carousel-item-wrapper ${
                                    selectedImage === img ? "active" : ""
                                }`}
                                onClick={() => setSelectedImage(img)}
                            >
                                <img src={img} alt={`thumb-${index}`} className="carousel-item" />
                                {selectedImage !== img && (
                                    <div className="carousel-overlay"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            </section>
        </>
    );
}

export default GalleryPage;