// src/component/macro-components/UmkmList.tsx
import { useEffect, useState } from "react";
import { UmkmRepository } from "../../../data/repositories/UmkmRepository";
// 1. Impor tipe data BARU
import type { UmkmFromDB } from "../../../shared/types/Umkm"; 
import UmkmCard from "../micro-components/UmkmCard";
import "../../../style/UmkmList.css";

// Fungsi getDistance (di-copy dari kode Anda)
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
    // 2. Gunakan tipe data BARU
    const [umkmList, setUmkmList] = useState<UmkmFromDB[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); // State error

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            setError(null);
            // 3. Tipe data result diubah ke UmkmFromDB
            let result: UmkmFromDB[];

            try {
                if (activeFilter === "Terdekat" && (geoLoading || geoError)) {
                    setUmkmList([]);
                    setLoading(false);
                    return;
                }

                // Logika 'if' ini sekarang akan BERFUNGSI
                if (searchQuery) {
                    result = await UmkmRepository.search(searchQuery);
                } else if (category) {
                    result = await UmkmRepository.findByCategory(category);
                } else if (activeFilter === "Terdekat") {
                    if (userLocation) {
                        const allData = await UmkmRepository.getAll();
                        result = allData.filter((umkm) => {
                            // Cek null/undefined pada lokasi
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
                        // Jika lokasi belum siap, tampilkan semua
                        result = await UmkmRepository.getAll();
                    }
                } else if (activeFilter === "Hidden Gem") {
                    const allData = await UmkmRepository.getAll();
                    result = allData.filter((umkm) => {
                        return (
                            // 4. Sesuaikan nama kolom DB
                            umkm.monthly_visits < 100 &&
                            umkm.total_visits < 50 &&
                            umkm.average_rating >= 4.5
                        );
                    });
                } else {
                    // Filter "Semua"
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
        }

        fetchData();
        
        // 5. Tambahkan dependensi. Setiap filter berubah, fetch ulang data.
    }, [searchQuery, category, activeFilter, userLocation, geoLoading, geoError]);

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