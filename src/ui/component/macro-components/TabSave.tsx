import { useState } from "react";
import Disimpan from "./Disimpan";
import DikunjungiTabs from "./DikunjungiTabs";

function TabSave() {
    const [activeTab, setActiveTab] = useState("disimpan");

    const tabs = [
        { id: "disimpan", label: "Umkm Disimpan" },
        { id: "dikunjugi", label: "Telah Dikunjugi" },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case "disimpan":
                return <Disimpan />;
            case "dikunjungi":
                return <DikunjungiTabs />;
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

export default TabSave;