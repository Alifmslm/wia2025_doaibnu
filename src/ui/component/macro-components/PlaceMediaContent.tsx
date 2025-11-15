import { useState } from "react";
import type { UmkmFromDB } from "../../../shared/types/Umkm"; 
import GalleryTabs from "./GalleryTabs";
import ReviewTabs from "./ReviewTabs";
import LocationTabs from "./LocationTabs";
import MenuPage from "../../page/MenuPage/MenuPage";
import "../../../style/PlaceMediaContent.css";

// 1. Definisikan props baru
interface PlaceMediaContentProps {
    umkm: UmkmFromDB;
    isOwner: boolean; // <-- Prop baru
}

function PlaceMediaContent({ umkm, isOwner }: PlaceMediaContentProps) { // <-- Terima prop baru
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
                return <GalleryTabs 
                            gallery={umkm.gallery} 
                            mainImage={umkm.gambar_utama} 
                        />;
            case "ulasan":
                return <ReviewTabs 
                            reviews={umkm.reviews} 
                            umkmId={umkm.id} 
                        />;
            case "lokasi":
                return <LocationTabs 
                            lokasi={umkm.lokasi} 
                            nama={umkm.nama} 
                        />;
            case "menu":
                // 2. Teruskan prop ke MenuPage
                return <MenuPage 
                            menuItems={umkm.menu_items} 
                            isOwner={isOwner} // <-- Teruskan
                            umkmId={umkm.id}    // <-- Teruskan ID
                        />
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