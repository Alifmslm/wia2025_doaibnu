import ImageIcon from "../../../assets/image-icon.png";

type GalleryTabsProps = {
    images: string[];
};

function GalleryTabs({ images }: GalleryTabsProps) {
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
                                <div className="overlay-content">
                                    <img src={ImageIcon} alt="" className="overlay-icon" />
                                    <p>Lihat Semua Foto</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </section>
            <a href="">Tambah Foto</a>
        </>
    );
}

export default GalleryTabs;
