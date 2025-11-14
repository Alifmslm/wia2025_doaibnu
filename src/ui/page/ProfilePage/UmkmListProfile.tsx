import { useState, useEffect } from "react";
import UmkmCard from "../../component/micro-components/UmkmCard";
import { UmkmRepository } from "../../../data/repositories/UmkmRepository";
import type { Umkm } from "../../../shared/types/Umkm";

function UmkmListProfile() {
    const [umkmList, setUmkmList] = useState<Umkm[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAllUmkms() {
            setLoading(true);
            const data = await UmkmRepository.getAll();
            setUmkmList(data);
            setLoading(false);
        }

        fetchAllUmkms();
    }, []);

    const renderContent = () => {
        if (loading) {
            return <p className="profile-list-message">Memuat UMKM...</p>;
        }

        if (umkmList.length === 0) {
            return (
                <>
                    <div className="umkm-list-profile__header list-empty">
                        <h3>Anda Belum Memiliki Umkm</h3>
                        <a href="">Daftarkan Umkm Anda</a>
                    </div>
                </>
            );
        }

        return (
            <div className="umkm-list-profile-items">
                {umkmList.map((umkm) => (
                    <UmkmCard key={umkm.id} umkm={umkm} />
                ))}
            </div>
        );
    };

    return (
        <section className="umkm-list-profile">
            <div className="umkm-list-profile__header">
                <h3>Daftar Umkm Saya </h3>
                <a href="/add-umkm" className="link-add-umkm">Daftarkan Umkm Anda</a>
            </div>
            {renderContent()}
        </section>
    );
}

export default UmkmListProfile;