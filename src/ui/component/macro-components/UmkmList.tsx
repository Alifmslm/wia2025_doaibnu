import { useEffect, useState } from "react";
import { UmkmRepository } from "../../../data/repositories/UmkmRepository";
import type { Umkm } from "../../../shared/types/Umkm";
import UmkmCard from "../micro-components/UmkmCard";
import "../../../style/UmkmList.css";

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
    const [umkmList, setUmkmList] = useState<Umkm[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            let result: Umkm[];

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

                        return distance <= 10;
                    });
                } else {
                    result = await UmkmRepository.getAll();
                }
            } else if (activeFilter === "Hidden Gem") {
                const allData = await UmkmRepository.getAll();
                result = allData.filter((umkm) => {
                    return (
                        umkm.monthlyEats < 100 &&
                        umkm.totalVisits < 50 &&
                        umkm.averageRating >= 4.5
                    );
                });
            } else {
                result = await UmkmRepository.getAll();
            }

            setUmkmList(result);
            setLoading(false);
        }

        fetchData();
    }, [searchQuery, category, activeFilter, userLocation, geoLoading, geoError]);

    if (loading) return <p className="no-data-text">Memuat data...</p>;

    if (activeFilter === "Terdekat" && geoLoading) {
        return <p className="no-data-text">Mencari lokasi Anda...</p>;
    }

    if (activeFilter === "Terdekat" && geoError) {
        return <p className="no-data-text">⚠️ {geoError}</p>;
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
