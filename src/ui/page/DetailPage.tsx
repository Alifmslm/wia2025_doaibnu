import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UmkmRepository } from "../../data/repositories/UmkmRepository";
import type { Umkm } from "../../shared/types/Umkm";
import HeaderDefault from "../component/macro-components/HeaderDefault";
import HeroDetail from "../component/macro-components/HeroDetail";
import RatingLabel from "../component/micro-components/RatingLabel";
import PlaceMediaContent from "../component/macro-components/PlaceMediaContent";
import "../../style/DetailPage.css";
import SaveIcon from "../../assets/save-button-grey.png";

function DetailPage() {
    const { id } = useParams();
    const [umkm, setUmkm] = useState<Umkm | null>(null);

    useEffect(() => {
        async function fetchData() {
            const data = await UmkmRepository.getById(Number(id));
            setUmkm(data || null);
        }
        fetchData();
    }, [id]);

    if (!umkm) return <p>Loading...</p>;

    return (
        <>
            <HeaderDefault />
            <HeroDetail images={umkm.gallery || []} />
            <div className="detail-content-container">
                <section className="detail-content">
                    <section className="label-content">
                        <div className="label-detail__on">{umkm.kategori}</div>
                        <button className="button-save-detail">
                            <img src={SaveIcon} alt="tombol simpan" />
                            Simpan Umkm
                        </button>
                    </section>

                    <div className="text-container-detail">
                        <h1>{umkm.nama}</h1>
                        <p>{umkm.lokasi?.lokasi_general}</p>
                    </div>

                    <RatingLabel rating={UmkmRepository.getAverageRating(umkm)} />
                    <p className="description-detail">{umkm.deskripsi}</p>
                    <p className="see-all-desc">Lihat Selengkapnya</p>

                    <PlaceMediaContent images={umkm.gallery || []} />
                </section>
            </div>
        </>
    );
}

export default DetailPage;