// src/ui/page/DetailPage/DetailPage.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UmkmRepository } from "../../data/repositories/UmkmRepository";
import { UserRepository } from "../../data/repositories/UserRepository"; // 1. Impor User Repo
import type { UmkmFromDB } from "../../shared/types/Umkm"; // 2. Impor Tipe BARU
import HeaderDefault from "../component/macro-components/HeaderDefault";
import HeroDetail from "../component/macro-components/HeroDetail";
import RatingLabel from "../component/micro-components/RatingLabel";
import PlaceMediaContent from "../component/macro-components/PlaceMediaContent";
import "../../style/DetailPage.css";
import { formatVisits } from '../../shared/utils/formater/Formatters.ts';
import Fab from '@mui/material/Fab';
import FormEditUmkm, { type FormEditData } from "./FormEditUmkm.tsx";
import { type User } from "@supabase/supabase-js"; // Impor tipe User

function DetailPage() {
    const { id } = useParams();
    // 3. Gunakan Tipe BARU di state
    const [umkm, setUmkm] = useState<UmkmFromDB | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null); // State untuk user
    const [isSaved, setIsSaved] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // 4. Perbarui 'fetchData' untuk mengambil UMKM dan User
        async function fetchData() {
            if (!id) {
                setError("ID UMKM tidak ditemukan.");
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);
            
            try {
                // Ambil data user dan UMKM secara bersamaan
                const userPromise = UserRepository.getCurrentUser();
                const umkmPromise = UmkmRepository.getById(Number(id));
                
                const [user, data] = await Promise.all([userPromise, umkmPromise]);

                setUmkm(data);
                setCurrentUser(user);

                // 5. Cek 'isSaved' HANYA jika user login DAN umkm ditemukan
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
    }, [id]); // 'id' adalah satu-satunya dependensi

    // 6. Hapus 'useEffect' untuk 'isSaved', karena sudah digabung di atas

    const handleOpenEditModal = () => setIsEditModalOpen(true);
    const handleCloseEditModal = () => setIsEditModalOpen(false);

    // 7. Perbarui fungsi 'handleUpdateUmkm'
    const handleUpdateUmkm = async (data: FormEditData) => {
        if (!umkm || !umkm.lokasi) return; // Guard clause

        console.log("Data baru yang akan di-update:", data);
        
        try {
            // Panggil Repository untuk update ke Supabase
            // Kirim 'umkm.lokasi' sebagai 'currentLokasi'
            const updatedUmkmData = await UmkmRepository.updateById(umkm.id, data, umkm.lokasi);

            // Gabungkan data lama (terutama menu & reviews) dengan data baru
            setUmkm(prevUmkm => ({
                ...(prevUmkm as UmkmFromDB), // Ambil data lama (menu, reviews, dll)
                ...updatedUmkmData, // Timpa dengan data yang di-update (nama, deskripsi, dll)
            }));
            
            handleCloseEditModal(); // Tutup modal
            
        } catch (err) {
            console.error("Gagal meng-update UMKM:", err);
            alert("Gagal menyimpan perubahan. Silakan coba lagi.");
        }
    };

    // 8. Tampilkan status Loading, Error, atau Tidak Ditemukan
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

    // 9. Perbarui 'handleSaveClick'
    const handleSaveClick = async (event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();

        if (!currentUser) {
            alert("Anda harus login untuk menyimpan UMKM.");
            // (Idealnya, arahkan ke halaman login)
            return;
        }

        // Optimis: langsung update UI
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
            // Rollback UI jika gagal
            setIsSaved(!newSavedStatus); 
        }
    };

    // 10. Sesuaikan nama properti (total_visits)
    const formattedVisits = formatVisits(umkm.total_visits);

    return (
        <>
            {/* Tombol Edit: Hanya tampil jika user adalah pemilik */}
            {currentUser && umkm.owner_id === currentUser.id && (
                 <Fab color="primary" className="fab-edit-umkm" aria-label="edit" onClick={handleOpenEditModal}>
                    <i className="fa-solid fa-pen"></i>
                 </Fab>
            )}
           
            <HeaderDefault />
            
            {/* 11. Kirim data gambar dinamis ke HeroDetail */}
            <HeroDetail 
                mainImage={umkm.gambar_utama}
                gallery={umkm.gallery}
            />
            
            <div className="detail-content-container">
                <section className="detail-content">
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
                        {/* 12. Kirim umkm (Tipe Baru) ke getAverageRating */}
                        <RatingLabel rating={UmkmRepository.getAverageRating(umkm)} />
                        <div className="visited-counter">
                            <i className="fa-solid fa-person-running"></i>
                            <p>{formattedVisits} pengunjung sudah kesini</p>
                        </div>
                    </div>
                    <p className="description-detail">{umkm.deskripsi}</p>

                    {/* 13. Kirim data UMKM penuh ke PlaceMediaContent */}
                    <PlaceMediaContent umkm={umkm} />
                </section>
            </div>
            
            {/* 14. Pastikan FormEditUmkm juga menggunakan tipe UmkmFromDB */}
            <FormEditUmkm
                open={isEditModalOpen}
                onClose={handleCloseEditModal}
                onUpdate={handleUpdateUmkm}
                umkm={umkm} 
            />
        </>
    );
}

export default DetailPage;