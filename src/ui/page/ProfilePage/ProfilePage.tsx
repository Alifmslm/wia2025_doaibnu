import { useState } from 'react';
import TabProfile from "./TabProfile";
import HeaderDefault from '../../component/macro-components/HeaderDefault';
import '../../../style/ProfilePage.css';

// Tipe ini akan kita gunakan bersama
export interface UserProfile {
    name: string;
    email: string;
}

// Tipe data yang akan dikirim dari form (termasuk file)
export interface ProfileUpdateData extends UserProfile {
    image: File | null;
}

function ProfilePage() {
    const getInitials = (name: string): string => name?.split(' ').filter(Boolean).map(word => word[0].toUpperCase()).join('') || '';

    // 1. Simpan data pengguna di state
    const [user, setUser] = useState<UserProfile>({
        name: "Alif Muslim Abdurrahman",
        email: "alifmslm01@gmail.com"
    });

    // 2. Buat fungsi untuk menangani pembaruan data
    const handleUpdateProfile = (newData: ProfileUpdateData) => {
        // Perbarui state dengan nama dan email baru
        setUser({ name: newData.name, email: newData.email });

        // Di sini Anda akan menangani logika upload gambar
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
                        {/* 3. Gunakan data dari state */}
                        <p>{getInitials(user.name)}</p>
                    </div>
                    {/* 4. Gunakan data dari state */}
                    <h2>{user.name}</h2>
                    <p>{user.email}</p>
                </div>
                
                {/* 5. Kirim state dan fungsi handler ke TabProfile */}
                <TabProfile user={user} onUpdateProfile={handleUpdateProfile} />
            </section>
        </>
    )
}

export default ProfilePage;