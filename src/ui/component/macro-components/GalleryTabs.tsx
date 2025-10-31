import ImageIcon from "../../../assets/image-icon.png";

import GalleryImage1 from '../../../assets/gallery-image-1.png';
import GalleryImage2 from '../../../assets/gallery-image-2.png';
import GalleryImage3 from '../../../assets/gallery-image-3.png';
import GalleryImage4 from '../../../assets/gallery-image-4.png';

function GalleryTabs() {
    // Buat array semua gambar gallery
    const images = [GalleryImage1, GalleryImage2, GalleryImage3, GalleryImage4];

    // ambil hanya 4 foto pertama untuk tampilan grid
    const previewImages = images.slice(0, 4);
    const hasMoreImages = images.length > 4;

    return (
        <>
            <section className="gallery-grid">
                {/* Foto A — besar di kiri */}
                <div className="gallery-item main">
                    <img src={previewImages[0]} alt="Main" className="gallery-img" />
                </div>

                {/* Foto B */}
                {previewImages[1] && (
                    <div className="gallery-item small" style={{ gridArea: "b" }}>
                        <img src={previewImages[1]} alt="Foto 2" className="gallery-img" />
                    </div>
                )}

                {/* Foto C */}
                {previewImages[2] && (
                    <div className="gallery-item small" style={{ gridArea: "c" }}>
                        <img src={previewImages[2]} alt="Foto 3" className="gallery-img" />
                    </div>
                )}

                {/* Foto D — dengan overlay jika ada lebih banyak foto */}
                {previewImages[3] && (
                    <div className={`gallery-item small ${hasMoreImages ? "overlay-item" : ""}`}
                        style={{ gridArea: "d" }}>
                        <img src={previewImages[3]} alt="Foto 4" className="gallery-img" />
                        {hasMoreImages && (
                            <div className="overlay">
                                <a href="/gallery-page-">
                                    <div className="overlay-content">
                                        <img src={ImageIcon} alt="" className="overlay-icon" />
                                        <p>Lihat Semua Foto</p>
                                    </div>
                                </a>
                            </div>
                        )}
                    </div>
                )}
            </section>
            <a href="/gallery-page-">Tambah Foto</a>
        </>
    );
}

export default GalleryTabs;