// src/component/macro-components/DikunjungiTabs.tsx
import { useState, useEffect } from "react";
import type { UmkmFromDB } from "../../../shared/types/Umkm"; // 1. Tipe BARU
import { UmkmRepository } from "../../../data/repositories/UmkmRepository";
import { UserRepository } from "../../../data/repositories/UserRepository"; // 2. Impor User Repo
import UmkmCard from "../micro-components/UmkmCard";

function DikunjungiTabs() {
    const [visitedUmkms, setVisitedUmkms] = useState<UmkmFromDB[]>([]); // 3. Tipe BARU
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchVisitedData = async () => {
        setLoading(true);
        setError(null);
        
        // 4. Dapatkan user
        const user = await UserRepository.getCurrentUser();
        if (!user) {
            setError("Anda harus login untuk melihat data ini.");
            setLoading(false);
            return;
        }

        try {
            // 5. Kirim ID user
            const data = await UmkmRepository.getVisitedUmkms(user.id);
            setVisitedUmkms(data);
        } catch (err) {
            console.error("Gagal fetch data dikunjungi:", err);
            setError("Gagal memuat data dikunjungi.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVisitedData();

        // Listener ini akan me-fetch ulang data (termasuk cek user)
        const cleanupListener = UmkmRepository.onVisitedDataChange(() => {
            console.log("Data 'Dikunjungi' berubah. Memuat ulang data...");
            fetchVisitedData();
        });

        return () => {
            cleanupListener();
        };
    }, []);

    if (loading) return <p>Memuat UMKM yang telah dikunjungi...</p>;
    if (error) return <p>{error}</p>;
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