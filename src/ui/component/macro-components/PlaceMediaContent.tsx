import { useState } from "react";
import GalleryTabs from "./GalleryTabs";
import ReviewTabs from "./ReviewTabs";
import LocationTabs from "./LocationTabs";
import "../../../style/PlaceMediaContent.css";

function PlaceMediaContent() {
    const [activeTab, setActiveTab] = useState("gallery");

    const tabs = [
        { id: "gallery", label: "Gallery" },
        { id: "ulasan", label: "Ulasan" },
        { id: "lokasi", label: "Lokasi" },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case "gallery":
                return <GalleryTabs />;
            case "ulasan":
                return <ReviewTabs />;
            case "lokasi":
                return <LocationTabs />;
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
