import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UmkmRepository } from "../../data/repositories/UmkmRepository";
import { UserRepository } from "../../data/repositories/UserRepository"; 
import type { UmkmFromDB } from "../../shared/types/Umkm"; 
import HeaderDefault from "../component/macro-components/HeaderDefault";
import HeroDetail from "../component/macro-components/HeroDetail";
import RatingLabel from "../component/micro-components/RatingLabel";
import PlaceMediaContent from "../component/macro-components/PlaceMediaContent";
import "../../style/DetailPage.css";
import { formatVisits } from '../../shared/utils/formater/Formatters.ts';
import Fab from '@mui/material/Fab';
import FormEditUmkm, { type FormEditData } from "./FormEditUmkm.tsx";
import { type User } from "@supabase/supabase-js";

function DetailPage() {
    const { id } = useParams();
    const [umkm, setUmkm] = useState<UmkmFromDB | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isSaved, setIsSaved] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // 1. Tambahkan state 'isSubmitting' untuk loading modal
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        async function fetchData() {
            if (!id) {
                setError("ID UMKM tidak ditemukan.");
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);
            
            try {
                const userPromise = UserRepository.getCurrentUser();
                const umkmPromise = UmkmRepository.getById(Number(id));
                const [user, data] = await Promise.all([userPromise, umkmPromise]);

                setUmkm(data);
                setCurrentUser(user);

                if (user && data) {
                    const savedStatus = await UmkmRepository.isSaved(data.id, user.id);
                    setIsSaved(savedStatus);
                }

            } catch (err) {
                console.error("Gagal fetch data detail:", err);
                setError("Gagal memuat data UMKM.");
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [id]); 

    const handleOpenEditModal = () => setIsEditModalOpen(true);
    const handleCloseEditModal = () => {
        // Jangan biarkan modal ditutup jika sedang submit
        if (!isSubmitting) {
            setIsEditModalOpen(false);
        }
    };

    // 2. Modifikasi 'handleUpdateUmkm' dengan state 'isSubmitting'
    const handleUpdateUmkm = async (data: FormEditData) => {
        if (!umkm || !umkm.lokasi) return;

        setIsSubmitting(true); // <-- Mulai loading
        console.log("Data baru yang akan di-update:", data);
        
        try {
            const updatedUmkmData = await UmkmRepository.updateById(umkm.id, data, umkm.lokasi);

            setUmkm(prevUmkm => ({
                ...(prevUmkm as UmkmFromDB), 
                ...updatedUmkmData, 
            }));
            
            handleCloseEditModal();
            
        } catch (err) {
            console.error("Gagal meng-update UMKM:", err);
            alert("Gagal menyimpan perubahan. Silakan coba lagi.");
        } finally {
            setIsSubmitting(false); // <-- Selesai loading
        }
    };

    // ... (if loading, if error, if !umkm tidak berubah) ...
    if (isLoading) {
        return (
            <>
                <HeaderDefault />
                <p className="no-data-text" style={{ padding: '2rem' }}>Memuat data UMKM...</p>
            </>
        );
    }

    if (error) {
        return (
            <>
                <HeaderDefault />
                <p className="no-data-text error" style={{ padding: '2rem' }}>Error: {error}</p>
            </>
        );
    }
    
    if (!umkm) {
         return (
            <>
                <HeaderDefault />
                <p className="no-data-text" style={{ padding: '2rem' }}>UMKM tidak ditemukan.</p>
            </>
        );
    }

    // ... (handleSaveClick tidak berubah) ...
    const handleSaveClick = async (event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        if (!currentUser) {
            alert("Anda harus login untuk menyimpan UMKM.");
            return;
        }
        const newSavedStatus = !isSaved;
        setIsSaved(newSavedStatus);
        try {
            if (newSavedStatus) {
                await UmkmRepository.save(umkm.id, currentUser.id);
            } else {
                await UmkmRepository.unsave(umkm.id, currentUser.id);
            }
        } catch (err) {
            console.error("Gagal menyimpan:", err);
            alert("Gagal menyimpan perubahan. Coba lagi.");
            setIsSaved(!newSavedStatus); 
        }
    };

    const formattedVisits = formatVisits(umkm.total_visits);

    return (
        <>
            {/* 3. Nonaktifkan tombol FAB saat modal sedang submit */}
            {currentUser && umkm.owner_id === currentUser.id && (
                 <Fab 
                    color="primary" 
                    className="fab-edit-umkm" 
                    aria-label="edit" 
                    onClick={handleOpenEditModal}
                    disabled={isSubmitting} 
                 >
                    <i className="fa-solid fa-pen"></i>
                 </Fab>
            )}
            
            <HeaderDefault />
            
            <HeroDetail 
                mainImage={umkm.gambar_utama}
                gallery={umkm.gallery}
            />
            
            <div className="detail-content-container">
                <section className="detail-content">
                    {/* ... (sisa JSX Anda tidak berubah) ... */}
                    <section className="label-content">
                        <div className="label-detail__on">{umkm.kategori}</div>
                        <button onClick={handleSaveClick} className="button-save-detail" style={{
                            color: isSaved ? '#FFD700' : '#ccc'
                        }}>
                            {isSaved ? (
                                <i className="fa-solid fa-bookmark fa-bookmark-detail"></i>
                            ) : (
                                <i className="fa-regular fa-bookmark fa-bookmark-detail"></i>
                            )}
                        </button>
                    </section>
                    <div className="text-container-detail">
                        <h1>{umkm.nama}</h1>
                        <p>{umkm.lokasi?.lokasi_general}</p>
                    </div>
                    <div className="detail-label">
                        <RatingLabel rating={UmkmRepository.getAverageRating(umkm)} />
                        <div className="visited-counter">
                            <i className="fa-solid fa-person-running"></i>
                            <p>{formattedVisits} pengunjung sudah kesini</p>
                        </div>
                    </div>
                    <p className="description-detail">{umkm.deskripsi}</p>
                    <PlaceMediaContent umkm={umkm} />
                </section>
            </div>
            
            {/* 4. Kirim 'isSubmitting' ke modal */}
            <FormEditUmkm
                open={isEditModalOpen}
                onClose={handleCloseEditModal}
                onUpdate={handleUpdateUmkm}
                umkm={umkm} 
                isSubmitting={isSubmitting} // <-- Kirim prop
            />
        </>
    );
}

export default DetailPage;