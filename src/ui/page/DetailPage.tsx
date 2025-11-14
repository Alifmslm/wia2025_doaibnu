import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UmkmRepository } from "../../data/repositories/UmkmRepository";
import type { Umkm } from "../../shared/types/Umkm";
import HeaderDefault from "../component/macro-components/HeaderDefault";
import HeroDetail from "../component/macro-components/HeroDetail";
import RatingLabel from "../component/micro-components/RatingLabel";
import PlaceMediaContent from "../component/macro-components/PlaceMediaContent";
import "../../style/DetailPage.css";
import { formatVisits } from '../../shared/utils/formater/Formatters.ts'
import Fab from '@mui/material/Fab';
import FormEditUmkm, { type FormEditData } from "./FormEditUmkm.tsx";

function DetailPage() {
    const { id } = useParams();
    const [umkm, setUmkm] = useState<Umkm | null>(null);
    const [isSaved, setIsSaved] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        async function fetchData() {
            const data = await UmkmRepository.getById(Number(id));
            setUmkm(data || null);
        }
        fetchData();
    }, [id]);

    useEffect(() => {
        if (umkm) {
            setIsSaved(UmkmRepository.isSaved(umkm.id));
        }
    }, [umkm]);

    const handleOpenEditModal = () => setIsEditModalOpen(true);
    const handleCloseEditModal = () => setIsEditModalOpen(false);

    // ==================================================================
    // INI ADALAH BAGIAN YANG DIPERBAIKI
    // ==================================================================
    const handleUpdateUmkm = (data: FormEditData) => {
        if (!umkm) return; // Guard clause

        console.log("Data baru yang akan di-update:", data);
        console.log("File yang di-upload:", data.images);

        // Update state lokal secara optimistik agar UI langsung berubah
        const updatedLokasi = {
            ...umkm.lokasi,
            // Gunakan data yang benar dari form
            lokasi_general: data.lokasiGeneral,
            alamat: data.alamat,
        };

        setUmkm({
            ...umkm,
            nama: data.nama,
            deskripsi: data.deskripsi,
            kategori: data.kategori,
            lokasi: updatedLokasi,
            // Catatan: Memperbarui gambar akan memerlukan logika upload file
        });

        handleCloseEditModal(); // Tutup modal setelah update
    };
    // ==================================================================
    // AKHIR DARI PERBAIKAN
    // ==================================================================

    // Blok useEffect yang duplikat telah saya hapus

    if (!umkm) return <p>Loading...</p>;

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

    const formattedVisits = formatVisits(umkm.totalVisits);

    return (
        <>
            <Fab color="primary" className="fab-edit-umkm" aria-label="edit" onClick={handleOpenEditModal}>
                <i className="fa-solid fa-pen"></i>
            </Fab>
            <HeaderDefault />
            <HeroDetail />
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
                        <RatingLabel rating={UmkmRepository.getAverageRating(umkm)} />
                        <div className="visited-counter">
                            <i className="fa-solid fa-person-running"></i>
                            <p>{formattedVisits} pengunjung sudah kesini</p>
                        </div>
                    </div>
                    <p className="description-detail">{umkm.deskripsi}</p>

                    <PlaceMediaContent umkmId={umkm.id} />
                </section>
            </div>
            {umkm && (
                <FormEditUmkm
                    open={isEditModalOpen}
                    onClose={handleCloseEditModal}
                    onUpdate={handleUpdateUmkm}
                    umkm={umkm}
                />
            )}
        </>
    );
}

export default DetailPage;