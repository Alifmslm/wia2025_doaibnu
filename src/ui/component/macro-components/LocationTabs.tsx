import '../../../style/LocationTab.css'
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Lokasi } from "../../../shared/types/Umkm";
import type { LatLngExpression } from 'leaflet';
import { Icon } from 'leaflet';

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

interface LocationTabsProps {
    lokasi: Lokasi | null;
    nama: string;
}

function LocationTabs({ lokasi, nama }: LocationTabsProps) {

    if (!lokasi) {
        return (
            <section className="location-tab">
                <h1>Lokasi</h1>
                <p>Data lokasi tidak tersedia.</p>
            </section>
        );
    }
    
    // Gunakan data latitude/longitude dari prop
    // Jika tidak ada (masih 0), set default ke lokasi (misal: Monas)
    // Ini penting agar peta tidak error jika lat/long masih 0
    const position: LatLngExpression = [
        lokasi.latitude === 0 ? -6.1754 : lokasi.latitude, 
        lokasi.longitude === 0 ? 106.8272 : lokasi.longitude
    ];
    
    // Cek apakah linkGmaps valid (dimulai dengan http)
    // 'lokasi.alamat' sekarang berisi 'linkGmaps'
    const isValidLink = lokasi.alamat && lokasi.alamat.startsWith('http');

    return (
        <>
            <section className="location-tab">
                <div className="location-header">
                    <h1>Lokasi</h1>
                    
                    {/* --- PERBAIKAN DI SINI --- */}
                    {/* Tampilkan lokasi general sebagai deskripsi, BUKAN alamat */}
                    <p>{lokasi.lokasi_general}</p>
                    
                    {/* Tampilkan link Gmaps HANYA jika valid */}
                    {isValidLink ? (
                        <a 
                            href={lokasi.alamat} // 'lokasi.alamat' = 'linkGmaps'
                            target="_blank" 
                            rel="noopener noreferrer"
                        >
                            Buka di Google Maps
                        </a>
                    ) : (
                        <p><i>Link Google Maps tidak tersedia.</i></p>
                    )}
                    {/* --- AKHIR PERBAIKAN --- */}

                </div>
                
                <MapContainer 
                    center={position} 
                    zoom={13} 
                    scrollWheelZoom={false} 
                    id='map' 
                    style={{ height: '300px', width: '100%' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={position} icon={DefaultIcon}>
                        <Popup>
                            {nama}<br />{lokasi.lokasi_general}
                        </Popup>
                    </Marker>
                </MapContainer>
            </section>
        </>
    )
}

export default LocationTabs;