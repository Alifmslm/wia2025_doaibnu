// src/component/macro-components/GalleryTabs.tsx
import ImageIcon from "../../../assets/image-icon.png";
import NoImage from '../../../assets/gallery-image-1.png'; // Fallback

// 1. Tentukan props
interface GalleryTabsProps {
    gallery: string[];
    mainImage: string;
}

function GalleryTabs({ gallery, mainImage }: GalleryTabsProps) {
    // 2. Gabungkan gambar utama dan galeri, hapus duplikat
    const images = Array.from(new Set([mainImage, ...gallery].filter(Boolean)));

    // Jika kosong, tampilkan fallback
    if (images.length === 0) {
        images.push(NoImage);
    }

    // 3. Ambil 4 foto pertama untuk grid
    const previewImages = images.slice(0, 4);
    const hasMoreImages = images.length > 4; // Cek jika ada LEBIH dari 4
    const remainingCount = images.length - 4;

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
                                <a href="#"> {/* TODO: Buat link ke halaman galeri penuh */}
                                    <div className="overlay-content">
                                        <img src={ImageIcon} alt="" className="overlay-icon" />
                                        {/* Tampilkan jumlah sisa foto */}
                                        <p>+{remainingCount} Foto Lainnya</p>
                                    </div>
                                </a>
                            </div>
                        )}
                    </div>
                )}
            </section>
            {/* TODO: Link "Tambah Foto" ini harusnya hanya muncul untuk pemilik UMKM */}
            <a href="#">Tambah Foto</a>
        </>
    );
}

export default GalleryTabs;