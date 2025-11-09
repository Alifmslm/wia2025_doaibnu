import { useState, useEffect } from "react";
import type { Umkm } from "../../../shared/types/Umkm";
import { UmkmRepository } from "../../../data/repositories/UmkmRepository";
import UmkmCard from "../micro-components/UmkmCard";
import Checkbox from "@mui/material/Checkbox";

function Disimpan() {
    const [savedUmkms, setSavedUmkms] = useState<Umkm[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSavedData() {
            setLoading(true);
            const data = await UmkmRepository.getSavedUmkms();
            setSavedUmkms(data);
            setLoading(false);
        }
        fetchSavedData();
    }, []);

    if (loading) return <p>Memuat UMKM yang disimpan...</p>;
    if (savedUmkms.length === 0) return <p>Anda belum menyimpan UMKM apapun.</p>;

    return (
        <section className="umkm-tersimpan-list">
            <div className="card-grid-simpan">
                {/* Melakukan loop untuk setiap item UMKM */}
                {savedUmkms.map((umkm) => (
                    <div key={umkm.id} className="simpan-item-row">
                        
                        {/* 1. Checkbox di luar kartu */}
                        <Checkbox/>

                        {/* 2. Kartu UMKM */}
                        {/* Kita bungkus dalam div agar ukurannya fleksibel */}
                        <div style={{ flex: 1 }}>
                            <UmkmCard umkm={umkm} />
                        </div>

                    </div>
                ))}
            </div>
        </section>
    );
}

export default Disimpan;