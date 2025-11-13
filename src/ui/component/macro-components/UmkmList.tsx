import { useEffect, useState } from "react";
import { UmkmRepository } from "../../../data/repositories/UmkmRepository";
import type { Umkm } from "../../../shared/types/Umkm";
import UmkmCard from "../micro-components/UmkmCard";
import "../../../style/UmkmList.css";

interface UmkmListProps {
    searchQuery: string;
    category: string;
    activeFilter: "Semua" | "Terdekat" | "Hidden Gem";
}

function UmkmList({ searchQuery, category, activeFilter }: UmkmListProps) {
    const [umkmList, setUmkmList] = useState<Umkm[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            let result: Umkm[];

            if (searchQuery) {
                result = await UmkmRepository.search(searchQuery);
            } else if (category) {
                result = await UmkmRepository.findByCategory(category);
            } else if (activeFilter === "Terdekat") {
                result = [];
            } else if (activeFilter === "Hidden Gem") {
                const allData = await UmkmRepository.getAll();

                result = allData.filter(umkm => {

                    return (
                        umkm.monthlyEats < 100 &&
                        umkm.totalVisits < 50 &&
                        umkm.averageRating >= 4.5
                    );
                });

            } else {
                // Defaultnya adalah "Semua"
                result = await UmkmRepository.getAll();
            }

            setUmkmList(result);
            setLoading(false);
        }

        fetchData();
    }, [searchQuery, category, activeFilter]);

    if (loading) return <p style={{ color: "white" }}>Memuat data...</p>;

    // Tambahan: Tampilkan pesan jika hasil filter kosong
    if (umkmList.length === 0) {
        return <p style={{ color: "white", textAlign: "center", width: "100%" }}>
            Tidak ada UMKM yang ditemukan dengan kriteria ini.
        </p>;
    }

    return (
        <section className="card-grid-container">
            <section className="card-grid">
                {umkmList.map((item) => (
                    <UmkmCard key={item.id} umkm={item} />
                ))}
            </section>
        </section>
    );
}

export default UmkmList;