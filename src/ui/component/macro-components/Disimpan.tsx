import { useState, useEffect } from "react"; // Pastikan React diimpor
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
        UmkmRepository.moveToVisited(umkmId);

        // 2. Update state lokal agar UI langsung berubah (kartu hilang)
        // Kita filter array 'savedUmkms' untuk membuang ID yang baru dipindahkan
        setSavedUmkms(prevList => prevList.filter(item => item.id !== umkmId));
    };
    // ---

    if (loading) return <p>Memuat UMKM yang disimpan...</p>;
    if (savedUmkms.length === 0) return <p>Anda belum menyimpan UMKM apapun.</p>;

    return (
        <section className="umkm-tersimpan-list">
            <div className="card-grid-simpan">
                {savedUmkms.map((umkm) => (
                    // Berikan style flex agar Checkbox dan Card sejajar
                    <div 
                        key={umkm.id} 
                        className="simpan-item-row"
                    >
                        
                        {/* 1. Checkbox dengan handler onChange */}
                        <Checkbox 
                            // Panggil handler dengan ID UMKM saat ini
                            onChange={() => handleCheckboxChange(umkm.id)}
                            inputProps={{ 'aria-label': `Tandai ${umkm.nama} sebagai dikunjungi` }}
                            title="Tandai sudah dikunjungi"
                        />

                        {/* 2. Kartu UMKM */}
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