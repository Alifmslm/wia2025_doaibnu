import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import TabProfile from "./TabProfile";
import HeaderDefault from '../../component/macro-components/HeaderDefault';
import '../../../style/ProfilePage.css';

// --- Tipe Data (Disederhanakan) ---
export interface UserProfile {
    id: string;
    name: string;
    email: string;
    // 'avatar_url' dihapus
}

export interface ProfileUpdateData {
    name: string;
    email: string;
    // 'image' dihapus
}
// ------------------------------

import { UserRepository } from '../../../data/repositories/UserRepository';

function ProfilePage() {
    const navigate = useNavigate();
    const getInitials = (name: string): string => name?.split(' ').filter(Boolean).map(word => word[0].toUpperCase()).join('') || '';

    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    useEffect(() => {
        async function fetchProfile() {
            setLoading(true);
            try {
                const data = await UserRepository.getCurrentUserProfile();
                if (data) {
                    console.log("Profil didapat:", data);
                    setUser({
                        id: data.auth.id,
                        name: data.profile.username || data.auth.email || 'User',
                        email: data.auth.email || '',
                    });
                } else {
                    console.log("Tidak ada sesi, kembali ke login.");
                    navigate('/login');
                }
            } catch (error) {
                console.error("Gagal fetch profil di halaman:", error);
                navigate('/login'); 
            } finally {
                setLoading(false);
            }
        }
        
        fetchProfile();
    }, [navigate]);

    const handleUpdateProfile = async (newData: ProfileUpdateData) => {
        if (!user) return; 

        setIsSubmitting(true);
        try {
            const { auth, profile } = await UserRepository.updateUserProfile(
                user.id,
                user.email,
                newData 
            );
            
            setUser({
                id: auth.id,
                name: profile.username || auth.email || 'User',
                email: auth.email || '',
            });
            
            alert("Profil berhasil diperbarui!");

        } catch (error) {
            console.error("Gagal update profil:", error);
            alert("Gagal memperbarui profil. Coba lagi.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- 1. TAMBAHKAN FUNGSI HANDLER LOGOUT ---
    const handleLogout = async () => {
        // Nonaktifkan tombol jika sedang ada proses lain
        if (isSubmitting) return; 

        if (window.confirm("Apakah Anda yakin ingin logout?")) {
            try {
                await UserRepository.logout();
                navigate('/login'); // Arahkan ke halaman login
            } catch (error) {
                console.error("Gagal logout:", error);
                alert("Gagal logout. Silakan coba lagi.");
            }
        }
    };
    // --- AKHIR FUNGSI BARU ---


    if (loading) {
        return (
            <>
                <HeaderDefault />
                <section className="profile-page">
                    <p>Memuat profil...</p>
                </section>
            </>
        );
    }
    
    if (!user) {
        return (
             <>
                <HeaderDefault />
                <section className="profile-page">
                    <p>Mengarahkan ke login...</p>
                </section>
            </>
        );
    }

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

                    {/* --- 2. TAMBAHKAN TOMBOL LOGOUT DI SINI --- */}
                    <button 
                        onClick={handleLogout} 
                        className="logout-button" // Tambahkan kelas untuk styling
                        disabled={isSubmitting}
                    >
                        Logout
                    </button>
                    {/* --- AKHIR TOMBOL BARU --- */}
                </div>
                
                <TabProfile 
                    user={user} 
                    onUpdateProfile={handleUpdateProfile}
                    isSubmitting={isSubmitting} 
                />
            </section>
        </>
    );
}

export default ProfilePage;