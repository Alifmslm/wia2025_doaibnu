// src/component/macro-components/UmkmList.tsx
import { useEffect, useState } from "react";
import { UmkmRepository } from "../../../data/repositories/UmkmRepository";
import type { Umkm } from "../../../shared/types/Umkm";
import UmkmCard from "../micro-components/UmkmCard";
import "../../../style/UmkmList.css";

function UmkmList({ searchQuery, category }: { searchQuery: string; category: string }) {
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
            } else {
                result = await UmkmRepository.getAll();
            }

            setUmkmList(result);
            setLoading(false);
        }

        fetchData();
    }, [searchQuery, category]);

    if (loading) return <p style={{ color: "white" }}>Memuat data...</p>;

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