import { useEffect, useState, useCallback } from "react";
import { UmkmRepository } from "../../../data/repositories/UmkmRepository";
import type { UmkmFromDB } from "../../../shared/types/Umkm";
import UmkmCard from "../micro-components/UmkmCard";
import "../../../style/UmkmList.css";

// Fungsi utilitas getDistance (tetap sama)
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
    category: string; // Filter Kategori (Indonesia, Western, dll)
    activeFilter: "Semua" | "Terdekat" | "Hidden Gem"; // Filter Tab (Semua, Hidden Gem, Terdekat)
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

    // FUNGSI UTAMA PENGAMBIL DATA DAN FILTER
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        let baseResult: UmkmFromDB[] = [];
        let finalResult: UmkmFromDB[] = [];

        try {

            // --- FASE 1: Ambil Data Dasar (Berdasarkan Search atau ActiveFilter) ---

            if (searchQuery) {
                // Prioritas 1: Search
                baseResult = await UmkmRepository.search(searchQuery);

            } else if (activeFilter === "Terdekat") {
                // Prioritas 2: Terdekat
                if (geoLoading || geoError) {
                    setUmkmList([]);
                    return;
                }
                if (userLocation) {
                    const allData = await UmkmRepository.getAll();
                    baseResult = allData.filter((umkm) => {
                        if (!umkm.lokasi?.latitude || !umkm.lokasi?.longitude) return false;
                        const distance = getDistance(
                            userLocation.latitude, userLocation.longitude,
                            umkm.lokasi.latitude, umkm.lokasi.longitude
                        );
                        return distance <= 10;
                    });
                }

            } else if (activeFilter === "Hidden Gem") {
                // Prioritas 3: Hidden Gem
                baseResult = await UmkmRepository.getHiddenGems();

            } else {
                // Default: Semua
                baseResult = await UmkmRepository.getAll();
            }


            // --- FASE 2: Terapkan Filter Kategori (Indonesia, Western, dll.) ---
            // Kunci: Filter ini harus diterapkan pada baseResult, tanpa memandang activeFilter

            if (category && category !== "") {
                // Cek apakah kategori UMKM cocok dengan kategori yang dipilih
                finalResult = baseResult.filter(umkm =>
                    // Asumsi: properti 'kategori' pada umkm.kategori cocok dengan nilai 'category'
                    umkm.kategori.toLowerCase() === category.toLowerCase()
                );
            } else {
                // Jika kategori kosong (reset), gunakan baseResult
                finalResult = baseResult;
            }


            setUmkmList(finalResult);

        } catch (err) {
            console.error("Gagal mengambil data list UMKM:", err);
            let msg = "Gagal memuat data.";
            if (err instanceof Error) msg = err.message;
            setError(msg);
        } finally {
            setLoading(false);
        }
    }, [searchQuery, category, activeFilter, userLocation, geoLoading, geoError]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        console.log("UmkmList: Mendengarkan perubahan data 'visited'...");

        const unsubscribe = UmkmRepository.onVisitedDataChange(() => {
            console.log("UmkmList: Sinyal 'visited' diterima! Memuat ulang data...");
            fetchData();
        });

        return () => {
            console.log("UmkmList: Berhenti mendengarkan perubahan.");
            unsubscribe();
        };

    }, [fetchData]);

    // --- Render Logic (tetap sama) ---

    if (loading) return <p className="no-data-text">Memuat data...</p>;
    // ... (sisa logika render tetap sama) ...

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