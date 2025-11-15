// 1. Impor 'useCallback' dari React
import { useEffect, useState, useCallback } from "react"; 
import { UmkmRepository } from "../../../data/repositories/UmkmRepository";
import type { UmkmFromDB } from "../../../shared/types/Umkm"; 
import UmkmCard from "../micro-components/UmkmCard";
import "../../../style/UmkmList.css";

// Fungsi getDistance (Tidak berubah)
function getDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
            Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}

interface UmkmListProps {
    searchQuery: string;
    category: string;
    activeFilter: "Semua" | "Terdekat" | "Hidden Gem";
    userLocation: { latitude: number; longitude: number } | null;
    geoLoading: boolean;
    geoError: string | null;
}

function UmkmList({
    searchQuery,
    category,
    activeFilter,
    userLocation,
    geoLoading,
    geoError,
}: UmkmListProps) {
    const [umkmList, setUmkmList] = useState<UmkmFromDB[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 2. Pisahkan 'fetchData' dan bungkus dengan 'useCallback'
    // Ini membuat fungsi 'fetchData' stabil dan bisa dipanggil dari mana saja
    // tanpa menyebabkan render ulang yang tidak perlu.
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        let result: UmkmFromDB[];

        try {
            if (activeFilter === "Terdekat" && (geoLoading || geoError)) {
                setUmkmList([]);
                setLoading(false);
                return;
            }

            if (searchQuery) {
                result = await UmkmRepository.search(searchQuery);
            } else if (category) {
                result = await UmkmRepository.findByCategory(category);
            } else if (activeFilter === "Terdekat") {
                if (userLocation) {
                    const allData = await UmkmRepository.getAll();
                    result = allData.filter((umkm) => {
                        if (!umkm.lokasi?.latitude || !umkm.lokasi?.longitude) {
                            return false;
                        }

                        const distance = getDistance(
                            userLocation.latitude,
                            userLocation.longitude,
                            umkm.lokasi.latitude,
                            umkm.lokasi.longitude
                        );

                        return distance <= 10; // Filter 10km
                    });
                } else {
                    result = await UmkmRepository.getAll();
                }
            } else if (activeFilter === "Hidden Gem") {
                const allData = await UmkmRepository.getAll();
                result = allData.filter((umkm) => {
                    return (
                        umkm.monthly_visits < 100 &&
                        umkm.total_visits < 50 &&
                        umkm.average_rating >= 4.5
                    );
                });
            } else {
                result = await UmkmRepository.getAll();
            }

            setUmkmList(result);

        } catch (err) {
            console.error("Gagal mengambil data list UMKM:", err);
            let msg = "Gagal memuat data.";
            if (err instanceof Error) msg = err.message;
            setError(msg);
        } finally {
            setLoading(false);
        }
    }, [searchQuery, category, activeFilter, userLocation, geoLoading, geoError]); // <-- Dependensi untuk useCallback

    // 3. useEffect ini sekarang HANYA memanggil 'fetchData' ketika filternya berubah
    useEffect(() => {
        fetchData();
    }, [fetchData]); // <-- Dependensinya adalah fungsi 'fetchData' itu sendiri

    
    // 4. TAMBAHKAN useEffect BARU ini untuk "mendengarkan" sinyal dari SavePage
    useEffect(() => {
        // Daftarkan listener saat komponen dimuat (mount)
        console.log("UmkmList: Mendengarkan perubahan data 'visited'...");
        
        const unsubscribe = UmkmRepository.onVisitedDataChange(() => {
            console.log("UmkmList: Sinyal 'visited' diterima! Memuat ulang data...");
            // Panggil fungsi 'fetchData' yang sama untuk refresh data
            fetchData();
        });

        // Kembalikan fungsi cleanup untuk 'unsubscribe' 
        // saat komponen dibongkar (unmount)
        return () => {
            console.log("UmkmList: Berhenti mendengarkan perubahan.");
            unsubscribe();
        };
        
    }, [fetchData]); // <-- 'fetchData' sebagai dependensi agar listener selalu up-to-date


    // --- Sisa kode (Render) tidak ada yang berubah ---

    if (loading) return <p className="no-data-text">Memuat data...</p>;

    if (activeFilter === "Terdekat" && geoLoading) {
        return <p className="no-data-text">Mencari lokasi Anda...</p>;
    }

    if (activeFilter === "Terdekat" && geoError) {
        return <p className="no-data-text">⚠️ {geoError}</p>;
    }

    if (error) {
        return <p className="no-data-text">⚠️ {error}</p>;
    }

    if (umkmList.length === 0) {
        return (
            <p className="no-data-text">
                Tidak ada UMKM yang ditemukan dengan kriteria ini.
            </p>
        );
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