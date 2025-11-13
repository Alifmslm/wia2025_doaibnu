import '../../../style/LocationTab.css'
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

function LocationTabs() {
    return (
        <>
            <section className="location-tab">
                <h1>Lokasi</h1>
                <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false} id='map'>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[51.505, -0.09]}>
                        <Popup>
                            A pretty CSS3 popup. <br /> Easily customizable.
                        </Popup>
                    </Marker>
                </MapContainer>
                <p>Jl. Rancakendal No.7, Ciburial, Kec. Cibeunying Kaler, Kabupaten Bandung, Jawa Barat</p>
            </section>
        </>
    )
}

export default LocationTabs