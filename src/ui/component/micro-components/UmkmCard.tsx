import React, { useState } from "react";
import { Link } from "react-router-dom";
import RatingLabel from "../micro-components/RatingLabel.tsx";
import type { Umkm } from "../../../shared/types/Umkm";
import { UmkmRepository } from "../../../data/repositories/UmkmRepository";
import HomeImage from '../../../assets/gallery-image-1.png';

// HAPUS: Impor gambar lama tidak lagi diperlukan
// import SaveButtonFilled from "../../../assets/save-button-colored.png";
// import SaveButtonEmpty from "../../../assets/save-button-empty.png";

function UmkmCard({ umkm }: { umkm: Umkm }) {
    const avgRating = UmkmRepository.getAverageRating(umkm);
    const totalRatings = umkm.ratings?.length || 0;

    // State untuk melacak status 'isSaved'
    const [isSaved, setIsSaved] = useState(() => UmkmRepository.isSaved(umkm.id));

    // Handler untuk tombol simpan
    const handleSaveClick = (event: React.MouseEvent) => {
        event.preventDefault(); // Mencegah navigasi Link
        event.stopPropagation();

        if (isSaved) {
            UmkmRepository.unsave(umkm.id);
            setIsSaved(false);
        } else {
            UmkmRepository.save(umkm.id);
            setIsSaved(true);
        }
    };

    return (
        <Link to={`/detail-page/${umkm.id}`} className="card-link">
            <section className="card">
                <div
                    className="card-image"
                    style={{
                        backgroundImage: `url(${HomeImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                >
                    <div className="card-meta">
                        <div className="category-label">
                            <p>{umkm.kategori}</p>
                        </div>

                        <button
                            className="save-button"
                            onClick={handleSaveClick}
                            // Style dasar agar tombol terlihat transparan
                            style={{ 
                                background: 'white', // Background putih kecil agar ikon terlihat jelas
                                border: 'none', 
                                borderRadius: '50%',
                                width: '32px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                fontSize: '16px', // Ukuran ikon
                                color: isSaved ? '#FFD700' : '#ccc' // Warna emas jika disimpan, abu jika belum
                            }}
                            aria-label={isSaved ? "Hapus dari simpanan" : "Simpan UMKM"}
                        >
                            {/* Logika pemilihan ikon Font Awesome */}
                            {isSaved ? (
                                // Ikon TERISI (Solid) jika disimpan
                                <i className="fa-solid fa-bookmark"></i>
                            ) : (
                                // Ikon GARIS (Regular) jika belum disimpan
                                <i className="fa-regular fa-bookmark"></i>
                            )}
                        </button>
                    </div>
                </div>

                <div className="card-content">
                    <RatingLabel rating={avgRating} total={totalRatings} />
                    <div className="card-text">
                        <h1>{umkm.nama}</h1>
                        <p>{umkm.lokasi?.lokasi_general}</p>
                    </div>
                </div>
            </section>
        </Link>
    );
}

export default UmkmCard;