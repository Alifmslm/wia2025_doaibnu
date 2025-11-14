import { useState } from "react";
import UmkmListProfile from "./UmkmListProfile";
import ProfileInfo from "./ProfileInfoPage";
// 1. Import tipe yang telah kita buat
import type { UserProfile, ProfileUpdateData } from "./ProfilePage";

// 2. Definisikan props yang akan diterima
interface TabProfileProps {
    user: UserProfile;
    onUpdateProfile: (data: ProfileUpdateData) => void;
}

function TabProfile({ user, onUpdateProfile }: TabProfileProps) { // 3. Terima props
    const [activeTab, setActiveTab] = useState("profile");

    const tabs = [
        { id: "profile", label: "Informasi Pribadi" },
        { id: "menu", label: "List UMKM" },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case "profile":
                // 4. Teruskan props ke ProfileInfoPage
                return <ProfileInfo user={user} onUpdateProfile={onUpdateProfile} />;
            case "menu":
                return <UmkmListProfile />;
            default:
                return null;
        }
    };

    return (
        <>
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
        </>
    )
}

export default TabProfile;