import { useState, useEffect } from "react";
import type { Umkm } from "../../../shared/types/Umkm";
import { UmkmRepository } from "../../../data/repositories/UmkmRepository";
import UmkmCard from "../micro-components/UmkmCard";

function DikunjungiTabs() {
    const [visitedUmkms, setVisitedUmkms] = useState<Umkm[]>([]);
    const [loading, setLoading] = useState(true);

    // Fungsi untuk mengambil data UMKM yang telah dikunjungi
    const fetchVisitedData = async () => {
        setLoading(true);
        const data = await UmkmRepository.getVisitedUmkms();
        setVisitedUmkms(data);
        setLoading(false);
    };

    useEffect(() => {
        // 1. Ambil data saat komponen pertama kali dimuat
        fetchVisitedData();

        // 2. Daftarkan listener untuk mendengarkan perubahan dari repository
        // Ini akan membuat tab diperbarui secara otomatis setelah Checkbox di tab Disimpan ditekan
        const cleanupListener = UmkmRepository.onVisitedDataChange(() => {
            console.log("Data 'Dikunjungi' berubah. Memuat ulang data...");
            fetchVisitedData();
        });

        // 3. Fungsi cleanup: hapus listener saat komponen di-unmount
        return () => {
            cleanupListener();
        };
    }, []);

    if (loading) return <p>Memuat UMKM yang telah dikunjungi...</p>;
    if (visitedUmkms.length === 0) return <p>Belum ada UMKM yang ditandai telah dikunjungi.</p>;

    return (
        <section className="umkm-dikunjungi-list">
            <div className="card-grid-dikunjngi"> 
                {visitedUmkms.map((umkm) => (
                    // UmkmCard akan menampilkan totalVisits yang sudah di-increment
                    <UmkmCard key={umkm.id} umkm={umkm} />
                ))}
            </div>
        </section>
    );
}

export default DikunjungiTabs;