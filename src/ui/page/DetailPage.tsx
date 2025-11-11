import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { UmkmRepository } from "../../data/repositories/UmkmRepository";
import type { Umkm } from "../../shared/types/Umkm";
import HeaderDefault from "../component/macro-components/HeaderDefault";
import HeroDetail from "../component/macro-components/HeroDetail";
import RatingLabel from "../component/micro-components/RatingLabel";
import PlaceMediaContent from "../component/macro-components/PlaceMediaContent";
import "../../style/DetailPage.css";
import { formatVisits } from '../../shared/utils/formater/Formatters.ts'

function DetailPage() {
    const { id } = useParams();
    const [umkm, setUmkm] = useState<Umkm | null>(null);
    const [isSaved, setIsSaved] = useState(false);

    const isMakanan = useMemo(() => {
        return umkm?.kategori === 'Makanan';
    }, [umkm]);

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
                    <hr className="hr-detail" />
                    <p className="description-detail">{umkm.deskripsi}</p>

                    {isMakanan && (
                        <button className="button-lihat-menu">Lihat Menu</button>
                    )}

                    <PlaceMediaContent />
                </section>
            </div>
        </>
    );
}

export default DetailPage;