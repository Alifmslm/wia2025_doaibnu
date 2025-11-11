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

    // --- HANDLER UNTUK CHECKBOX ---
    const handleCheckboxChange = (umkmId: number) => {
        // 1. Panggil Repository untuk memindahkan data di localStorage
        // Panggilan ini sekarang memicu Event Emitter di Repository
        UmkmRepository.moveToVisited(umkmId);

        // 2. Update state lokal agar UI langsung berubah (kartu hilang)
        setSavedUmkms(prevList => prevList.filter(item => item.id !== umkmId));
    };
    // ---

    if (loading) return <p>Memuat UMKM yang disimpan...</p>;
    if (savedUmkms.length === 0) return <p>Anda belum menyimpan UMKM apapun.</p>;

    return (
        <section className="umkm-tersimpan-list">
            <div className="card-grid-simpan">
                {savedUmkms.map((umkm) => (
                    <div 
                        key={umkm.id} 
                        className="simpan-item-row"
                    >
                        
                        <Checkbox 
                            onChange={() => handleCheckboxChange(umkm.id)}
                            inputProps={{ 'aria-label': `Tandai ${umkm.nama} sebagai dikunjungi` }}
                            title="Tandai sudah dikunjungi"
                        />

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