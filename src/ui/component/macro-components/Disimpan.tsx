// src/component/macro-components/Disimpan.tsx
import { useState, useEffect } from "react"; 
import type { UmkmFromDB } from "../../../shared/types/Umkm"; // 1. Tipe BARU
import { UmkmRepository } from "../../../data/repositories/UmkmRepository";
import { UserRepository } from "../../../data/repositories/UserRepository"; // 2. Impor User Repo
import UmkmCard from "../micro-components/UmkmCard";
import Checkbox from "@mui/material/Checkbox";

function Disimpan() {
    const [savedUmkms, setSavedUmkms] = useState<UmkmFromDB[]>([]); // 3. Tipe BARU
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<any>(null); // State untuk user

    useEffect(() => {
        async function fetchSavedData() {
            setLoading(true);
            setError(null);
            
            // 4. Dapatkan user terlebih dahulu
            const user = await UserRepository.getCurrentUser();
            if (!user) {
                setError("Anda harus login untuk melihat data ini.");
                setLoading(false);
                return;
            }
            setCurrentUser(user); // Simpan user

            try {
                // 5. Kirim ID user
                const data = await UmkmRepository.getSavedUmkms(user.id);
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

    const handleCheckboxChange = async (umkmId: number) => {
        if (!currentUser) {
            alert("Sesi Anda berakhir. Silakan login kembali.");
            return;
        }
        
        if (!window.confirm("Pindahkan UMKM ini ke daftar 'Telah Dikunjungi'?")) {
            return;
        }
        
        try {
            // 6. Kirim ID user
            await UmkmRepository.moveToVisited(umkmId, currentUser.id);
            setSavedUmkms(prevList => prevList.filter(item => item.id !== umkmId));
        } catch (err) {
            console.error("Gagal memindahkan ke 'dikunjungi':", err);
            alert("Gagal memindahkan UMKM. Coba lagi.");
        }
    };

    if (loading) return <p>Memuat UMKM yang disimpan...</p>;
    if (error) return <p>{error}</p>;
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