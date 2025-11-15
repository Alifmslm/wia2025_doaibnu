// src/component/macro-components/LocationTabs.tsx
import '../../../style/LocationTab.css'
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
// 1. Hapus UmkmRepository
// import { UmkmRepository } from '../../../data/repositories/UmkmRepository';
import type { Lokasi } from "../../../shared/types/Umkm";
import type { LatLngExpression } from 'leaflet';
import { Icon } from 'leaflet'; // Import Icon

// Fix untuk ikon Leaflet yang hilang di React
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = new Icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
// --- Akhir Fix Ikon ---

// 2. Tentukan props
interface LocationTabsProps {
    lokasi: Lokasi | null;
    nama: string;
}

function LocationTabs({ lokasi, nama }: LocationTabsProps) {
    // 3. Hapus semua 'useState' dan 'useEffect'
    //    Data sudah ada di props

    if (!lokasi) {
        return (
            <section className="location-tab">
                <h1>Lokasi</h1>
                <p>Data lokasi tidak tersedia.</p>
            </section>
        );
    }
    
    // 4. Gunakan data latitude/longitude dari prop
    //    Jika tidak ada, set default ke lokasi (misal: Monas)
    const position: LatLngExpression = [
        lokasi.latitude || -6.1754, 
        lokasi.longitude || 106.8272
    ];

    return (
        <>
            <section className="location-tab">
                <div className="location-header">
                    <h1>Lokasi</h1>
                    <p>{lokasi.alamat}</p>
                </div>
                {/* 5. Pastikan map memiliki tinggi, jika tidak ia akan 0px */}
                <MapContainer center={position} zoom={13} scrollWheelZoom={false} id='map' style={{ height: '300px', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={position} icon={DefaultIcon}>
                        <Popup>
                            {nama}<br />{lokasi.alamat}
                        </Popup>
                    </Marker>
                </MapContainer>
            </section>
        </>
    )
}

export default LocationTabs;