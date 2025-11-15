// src/component/macro-components/DikunjungiTabs.tsx
import { useState, useEffect } from "react";
// 1. Impor tipe BARU
import type { UmkmFromDB } from "../../../shared/types/Umkm";
import { UmkmRepository } from "../../../data/repositories/UmkmRepository";
import UmkmCard from "../micro-components/UmkmCard";

function DikunjungiTabs() {
    // 2. Gunakan tipe BARU
    const [visitedUmkms, setVisitedUmkms] = useState<UmkmFromDB[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); // Tambah state error

    // Fungsi untuk mengambil data UMKM yang telah dikunjungi
    const fetchVisitedData = async () => {
        setLoading(true);
        setError(null);
        try {
            // 3. Panggil fungsi repository yang baru
            const data = await UmkmRepository.getVisitedUmkms();
            setVisitedUmkms(data);
        } catch (err) {
            console.error("Gagal fetch data dikunjungi:", err);
            setError("Gagal memuat data dikunjungi.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // 1. Ambil data saat komponen pertama kali dimuat
        fetchVisitedData();

        // 2. Daftarkan listener
        const cleanupListener = UmkmRepository.onVisitedDataChange(() => {
            console.log("Data 'Dikunjungi' berubah. Memuat ulang data...");
            fetchVisitedData();
        });

        // 3. Fungsi cleanup
        return () => {
            cleanupListener();
        };
    }, []);

    if (loading) return <p>Memuat UMKM yang telah dikunjungi...</p>;
    if (error) return <p>Error: {error}</p>; // Tampilkan error
    if (visitedUmkms.length === 0) return <p>Belum ada UMKM yang ditandai telah dikunjungi.</p>;

    return (
        <section className="umkm-dikunjungi-list">
            <div className="card-grid-dikunjngi"> 
                {visitedUmkms.map((umkm) => (
                    // 4. UmkmCard sekarang menerima tipe UmkmFromDB (sudah cocok)
                    <UmkmCard key={umkm.id} umkm={umkm} />
                ))}
            </div>
        </section>
    );
}

export default DikunjungiTabs;