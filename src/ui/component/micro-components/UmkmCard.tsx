// src/component/micro-components/UmkmCard.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import RatingLabel from "../micro-components/RatingLabel.tsx";
// 1. Impor tipe data BARU
import type { UmkmFromDB } from "../../../shared/types/Umkm"; 
import { UmkmRepository } from "../../../data/repositories/UmkmRepository"; 
import HomeImage from '../../../assets/gallery-image-1.png'; // Fallback
import { formatVisits } from "../../../shared/utils/formater/Formatters.ts";

// 2. Ubah tipe prop menjadi UmkmFromDB
function UmkmCard({ umkm }: { umkm: UmkmFromDB }) {
    
    // 3. Panggil fungsi getAverageRating (sekarang sudah ada lagi)
    const avgRating = UmkmRepository.getAverageRating(umkm);
    const totalRatings = umkm.reviews?.length || 0; // Ganti 'ratings' ke 'reviews'
    const formattedVisits = formatVisits(umkm.total_visits); // Ganti 'totalVisits' ke 'total_visits'

    // 4. Panggil fungsi isSaved (sekarang sudah ada lagi, walau mock)
    const [isSaved, setIsSaved] = useState(() => UmkmRepository.isSaved(umkm.id));

    const handleSaveClick = (event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        
        alert("Fitur 'Simpan' akan segera hadir dengan Autentikasi!");

        // 5. Logika lama (isSaved) bisa diaktifkan
        //    tapi tidak akan melakukan apa-apa sampai 'save/unsave' di repo di-update
        // if (isSaved) {
        //     // UmkmRepository.unsave(umkm.id); // Belum ada
        //     setIsSaved(false);
        // } else {
        //     // UmkmRepository.save(umkm.id); // Belum ada
        //     setIsSaved(true);
        // }
    };

    // 6. Ambil URL gambar dari prop (nama kolom sudah benar)
    const imageUrl = umkm.gambar_utama || HomeImage;

    return (
        <Link to={`/detail-page/${umkm.id}`} className="card-link">
            <section className="card">
                <div
                    className="card-image"
                    style={{
                        backgroundImage: `url(${imageUrl})`,
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
                            <p>{formattedVisits} pengunjung sudah kesini</p> 
                        </div>
                    </div>
                </div>
            </section>
        </Link>
    );
}

export default UmkmCard;