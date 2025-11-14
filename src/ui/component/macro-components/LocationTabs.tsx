import '../../../style/LocationTab.css'
import { useEffect, useState } from 'react';
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { UmkmRepository } from '../../../data/repositories/UmkmRepository';
import type { Lokasi } from "../../../shared/types/Umkm";
import type { LatLngExpression } from 'leaflet';

interface LocationTabsProps {
    umkmId: number;
}

function LocationTabs({ umkmId }: LocationTabsProps) {
    const [lokasi, setLokasi] = useState<Lokasi | null>(null);
    const [nama, setNama] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const umkm = await UmkmRepository.getById(umkmId);

            if (umkm && umkm.lokasi && umkm.lokasi.latitude && umkm.lokasi.longitude) {
                setLokasi(umkm.lokasi);
                setNama(umkm.nama);
            } else {
                console.error("Data lokasi tidak ditemukan atau tidak memiliki koordinat.");
                setLokasi(null);
            }
            setLoading(false);
        }
        fetchData();
    }, [umkmId]);

    if (loading) {
        return (
            <section className="location-tab">
                <h1>Lokasi</h1>
                <p>Memuat peta...</p>
            </section>
        );
    }

    if (!lokasi) {
        return (
            <section className="location-tab">
                <h1>Lokasi</h1>
                <p>Data lokasi tidak tersedia.</p>
            </section>
        );
    }

    const position: LatLngExpression = [lokasi.latitude, lokasi.longitude];

    return (
        <>
            <section className="location-tab">
                <div className="location-header">
                    <h1>Lokasi</h1>
                    <p>{lokasi.alamat}</p>
                </div>
                <MapContainer center={position} zoom={13} scrollWheelZoom={false} id='map'>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={position}>
                        <Popup>
                            {nama}<br />{lokasi.alamat}
                        </Popup>
                    </Marker>
                </MapContainer>
            </section>
        </>
    )
}

export default LocationTabs