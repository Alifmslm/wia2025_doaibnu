// src/component/micro-components/UmkmCard.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import RatingLabel from "../micro-components/RatingLabel.tsx";
import type { UmkmFromDB } from "../../../shared/types/Umkm";
import { UmkmRepository } from "../../../data/repositories/UmkmRepository";
import { UserRepository } from "../../../data/repositories/UserRepository";
import HomeImage from '../../../assets/gallery-image-1.png';
import { formatVisits } from "../../../shared/utils/formater/Formatters.ts";

function UmkmCard({ umkm }: { umkm: UmkmFromDB }) {

    const avgRating = UmkmRepository.getAverageRating(umkm);
    const totalRatings = umkm.reviews?.length || 0;
    const formattedVisits = formatVisits(umkm.monthly_visits);

    const [isSaved, setIsSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        async function checkIsSaved() {
            const user = await UserRepository.getCurrentUser();
            if (user) {
                const saved = await UmkmRepository.isSaved(umkm.id, user.id);
                setIsSaved(saved);
            }
        }
        checkIsSaved();
    }, [umkm.id]);

    const handleSaveClick = async (event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();

        // 1. Dapatkan user
        const user = await UserRepository.getCurrentUser();
        if (!user) {
            alert("Anda harus login untuk menyimpan UMKM.");
            return;
        }

        setIsSaving(true);
        try {
            if (isSaved) {
                // 2. Kirim user ID
                await UmkmRepository.unsave(umkm.id, user.id);
                setIsSaved(false);
            } else {
                // 3. Kirim user ID
                await UmkmRepository.save(umkm.id, user.id);
                setIsSaved(true);
            }
        } catch (err) {
            console.error("Gagal menyimpan:", err);
            alert("Gagal menyimpan. Coba lagi.");
        } finally {
            setIsSaving(false);
        }
    };

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
                            disabled={isSaving}
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