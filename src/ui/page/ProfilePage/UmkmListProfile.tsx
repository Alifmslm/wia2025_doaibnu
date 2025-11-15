import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import UmkmCard from "../../component/micro-components/UmkmCard";
import { UmkmRepository } from "../../../data/repositories/UmkmRepository";
import { UserRepository } from "../../../data/repositories/UserRepository"; 
import type { UmkmFromDB } from "../../../shared/types/Umkm";

function UmkmListProfile() {
    // 4. Perbarui tipe state
    const [umkmList, setUmkmList] = useState<UmkmFromDB[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); // Tambah state error

    useEffect(() => {
        // 5. Modifikasi total fungsi fetch data
        async function fetchMyUmkms() {
            setLoading(true);
            setError(null);
            
            try {
                // 5a. Dapatkan user yang sedang login
                const user = await UserRepository.getCurrentUser();
                
                if (!user) {
                    // Jika tidak ada user, tampilkan error
                    setError("Anda harus login untuk melihat UMKM Anda.");
                    setUmkmList([]);
                    return;
                }
                
                // 5b. Panggil fungsi repository yang BARU dengan ID user
                const data = await UmkmRepository.getByOwnerId(user.id);
                setUmkmList(data);

            } catch (err) {
                console.error("Gagal mengambil UMKM milik saya:", err);
                setError("Gagal memuat UMKM Anda. Coba lagi nanti.");
            } finally {
                setLoading(false);
            }
        }

        fetchMyUmkms();
    }, []); // Dependensi kosong, hanya jalan sekali saat mount

    const renderContent = () => {
        if (loading) {
            return <p className="profile-list-message">Memuat UMKM Anda...</p>;
        }

        // 6. Tampilkan pesan error jika ada
        if (error) {
            return <p className="profile-list-message" style={{ color: 'red' }}>{error}</p>;
        }

        if (umkmList.length === 0) {
            return (
                <>
                    <div className="umkm-list-profile__header list-empty">
                        <h3>Anda Belum Memiliki Umkm</h3>
                        {/* 7. Ganti <a> dengan <Link> */}
                        <Link to="/add-umkm">Daftarkan Umkm Anda</Link>
                    </div>
                </>
            );
        }

        return (
            <div className="umkm-list-profile-items">
                {umkmList.map((umkm) => (
                    <UmkmCard key={umkm.id} umkm={umkm} />
                ))}
            </div>
        );
    };

    return (
        <section className="umkm-list-profile">
            <div className="umkm-list-profile__header">
                <h3>Daftar Umkm Saya </h3>
                 {/* 8. Ganti <a> dengan <Link> */}
                <Link to="/add-umkm" className="link-add-umkm">Daftarkan Umkm Anda</Link>
            </div>
            {renderContent()}
        </section>
    );
}

export default UmkmListProfile;