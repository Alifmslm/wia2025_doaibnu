// src/component/macro-components/PlaceMediaContent.tsx
import { useState } from "react";
// Impor Tipe BARU
import type { UmkmFromDB } from "../../../shared/types/Umkm"; 

// Impor komponen tab (asumsi path)
import GalleryTabs from "./GalleryTabs";
import ReviewTabs from "./ReviewTabs";
import LocationTabs from "./LocationTabs";
import MenuPage from "../../page/MenuPage/MenuPage";
import "../../../style/PlaceMediaContent.css";

// 1. Tentukan props yang diterima
interface PlaceMediaContentProps {
    umkm: UmkmFromDB;
}

function PlaceMediaContent({ umkm }: PlaceMediaContentProps) {
    const [activeTab, setActiveTab] = useState("menu");

    const tabs = [
        { id: "menu", label: "Menu" },
        { id: "gallery", label: "Gallery" },
        { id: "ulasan", label: "Ulasan" },
        { id: "lokasi", label: "Lokasi" },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case "gallery":
                // 2. PERBAIKAN: Kirim 'gambar_utama' juga
                return <GalleryTabs 
                            gallery={umkm.gallery} 
                            mainImage={umkm.gambar_utama} 
                       />;
            case "ulasan":
                // 3. Kirim data reviews (Sudah Benar)
                return <ReviewTabs 
                            reviews={umkm.reviews} 
                            umkmId={umkm.id} 
                       />;
            case "lokasi":
                // 4. PERBAIKAN: Kirim 'nama' juga
                return <LocationTabs 
                            lokasi={umkm.lokasi} 
                            nama={umkm.nama} 
                       />;
            case "menu":
                // 5. Kirim data menu (Sudah Benar)
                return <MenuPage menuItems={umkm.menu_items} />
            default:
                return null;
        }
    };

    return (
        <section className="tabview-container">
            <div className="tab-header">
                {tabs.map((tab) => (
                    <a
                        key={tab.id}
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            setActiveTab(tab.id);
                        }}
                        className={`tab-link ${activeTab === tab.id ? "active" : ""}`}
                    >
                        {tab.label}
                        <span className="tab-indicator"></span>
                    </a>
                ))}
            </div>

            <div className="tab-content">{renderContent()}</div>
        </section>
    );
}

export default PlaceMediaContent;