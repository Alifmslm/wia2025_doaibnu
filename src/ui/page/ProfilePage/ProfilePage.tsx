import { useState } from 'react';
import TabProfile from "./TabProfile";
import HeaderDefault from '../../component/macro-components/HeaderDefault';
import '../../../style/ProfilePage.css';

export interface UserProfile {
    name: string;
    email: string;
}

export interface ProfileUpdateData extends UserProfile {
    image: File | null;
}

function ProfilePage() {
    const getInitials = (name: string): string => name?.split(' ').filter(Boolean).map(word => word[0].toUpperCase()).join('') || '';

    const [user, setUser] = useState<UserProfile>({
        name: "Alif Muslim Abdurrahman",
        email: "alifmslm01@gmail.com"
    });

    const handleUpdateProfile = (newData: ProfileUpdateData) => {
        setUser({ name: newData.name, email: newData.email });

        if (newData.image) {
            console.log("File gambar baru siap di-upload:", newData.image.name);
            // TODO: Tambahkan logika API untuk upload gambar
        }
    };

    return (
        <>
            <HeaderDefault />
            <section className="profile-page">
                <div className="profile-info-header">
                    <div className="profile-picture">
                        <p>{getInitials(user.name)}</p>
                    </div>
                    <h2>{user.name}</h2>
                    <p>{user.email}</p>
                </div>
                <TabProfile user={user} onUpdateProfile={handleUpdateProfile} />
            </section>
        </>
    )
}

export default ProfilePage;