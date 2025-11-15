// src/component/macro-components/Disimpan.tsx
import { useState, useEffect } from "react"; 
// 1. Impor tipe BARU
import type { UmkmFromDB } from "../../../shared/types/Umkm";
import { UmkmRepository } from "../../../data/repositories/UmkmRepository";
import UmkmCard from "../micro-components/UmkmCard";
import Checkbox from "@mui/material/Checkbox";

function Disimpan() {
    // 2. Gunakan tipe BARU
    const [savedUmkms, setSavedUmkms] = useState<UmkmFromDB[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); // Tambah state error

    useEffect(() => {
        async function fetchSavedData() {
            setLoading(true);
            setError(null);
            try {
                // 3. Panggil fungsi repository yang baru
                const data = await UmkmRepository.getSavedUmkms();
                setSavedUmkms(data);
            } catch (err) {
                console.error("Gagal fetch data tersimpan:", err);
                setError("Gagal memuat data tersimpan.");
            } finally {
                setLoading(false);
            }
        }
        fetchSavedData();
    }, []);

    // 4. Perbarui handler checkbox menjadi async
    const handleCheckboxChange = async (umkmId: number) => {
        // Tampilkan konfirmasi
        if (!window.confirm("Pindahkan UMKM ini ke daftar 'Telah Dikunjungi'?")) {
            return;
        }
        
        try {
            // 1. Panggil Repository (sekarang async)
            await UmkmRepository.moveToVisited(umkmId);
            
            // 2. Update state lokal agar UI langsung berubah
            setSavedUmkms(prevList => prevList.filter(item => item.id !== umkmId));
        } catch (err) {
            console.error("Gagal memindahkan ke 'dikunjungi':", err);
            alert("Gagal memindahkan UMKM. Coba lagi.");
        }
    };
    // ---

    if (loading) return <p>Memuat UMKM yang disimpan...</p>;
    if (error) return <p>Error: {error}</p>; // Tampilkan error
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
                            {/* 5. UmkmCard sekarang menerima tipe UmkmFromDB (sudah cocok) */}
                            <UmkmCard umkm={umkm} />
                        </div>

                    </div>
                ))}
            </div>
        </section>
    );
}

export default Disimpan;