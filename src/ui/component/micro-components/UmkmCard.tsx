import React, { useState } from "react";
import { Link } from "react-router-dom";
import RatingLabel from "../micro-components/RatingLabel.tsx";
import type { Umkm } from "../../../shared/types/Umkm";
import { UmkmRepository } from "../../../data/repositories/UmkmRepository";
import HomeImage from '../../../assets/gallery-image-1.png';

/**
 * Fungsi utilitas untuk memformat jumlah kunjungan menjadi 999+ jika lebih.
 */
const formatVisits = (count: number): string => {
    if (count > 999) {
        return "999+";
    }
    return count.toString();
}

function UmkmCard({ umkm }: { umkm: Umkm }) {
    const avgRating = UmkmRepository.getAverageRating(umkm);
    const totalRatings = umkm.ratings?.length || 0;
    
    // Mengambil totalVisits dan memformatnya
    const formattedVisits = formatVisits(umkm.totalVisits);

    // State untuk melacak status 'isSaved'
    const [isSaved, setIsSaved] = useState(() => UmkmRepository.isSaved(umkm.id));

    // Handler untuk tombol simpan
    const handleSaveClick = (event: React.MouseEvent) => {
        event.preventDefault();
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
                            style={{
                                color: isSaved ? '#FFD700' : '#ccc'
                            }}
                            aria-label={isSaved ? "Hapus dari simpanan" : "Simpan UMKM"}
                        >
                            {isSaved ? (
                                <i className="fa-solid fa-bookmark"></i>
                            ) : (
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
                    <div className="visit-container">
                        <div className="visited-counter">
                            <i className="fa-solid fa-person-running"></i>
                            {/* Menggunakan formattedVisits yang dinamis */}
                            <p>{formattedVisits} pengunjung sudah kesini</p> 
                        </div>
                    </div>
                </div>
            </section>
        </Link>
    );
}

export default UmkmCard;