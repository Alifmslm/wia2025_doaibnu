import { useState, useEffect } from "react";
import type { Umkm } from "../../../shared/types/Umkm";
import { UmkmRepository } from "../../../data/repositories/UmkmRepository";
import UmkmCard from "../micro-components/UmkmCard";

function DikunjungiTabs() {
    const [visitedUmkms, setVisitedUmkms] = useState<Umkm[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchVisitedData() {
            setLoading(true);
            const data = await UmkmRepository.getVisitedUmkms();
            setVisitedUmkms(data);
            setLoading(false);
        }
        fetchVisitedData();
    }, []);

    if (loading) return <p>Memuat UMKM yang telah dikunjungi...</p>;
    if (visitedUmkms.length === 0) return <p>Belum ada UMKM yang ditandai telah dikunjungi.</p>;

    return (
        <section className="umkm-dikunjungi-list">
            <div className="card-grid-dikunjngi"> 
                {visitedUmkms.map((umkm) => (
                    <UmkmCard key={umkm.id} umkm={umkm} />
                ))}
            </div>
        </section>
    );
}

export default DikunjungiTabs;