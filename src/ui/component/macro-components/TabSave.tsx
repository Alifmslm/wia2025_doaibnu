import { useState, useEffect, useCallback } from "react";
import Disimpan from "./Disimpan";
import DikunjungiTabs from "./DikunjungiTabs";
import { UmkmRepository } from "../../../data/repositories/UmkmRepository";
import { UserRepository } from "../../../data/repositories/UserRepository";
import type { UmkmFromDB } from "../../../shared/types/Umkm";
import type { User } from "@supabase/supabase-js"; // Impor tipe User

function TabSave() {
    const [activeTab, setActiveTab] = useState("disimpan");

    // 1. State untuk data dan loading diangkat ke induk ini
    const [savedUmkms, setSavedUmkms] = useState<UmkmFromDB[]>([]);
    const [visitedUmkms, setVisitedUmkms] = useState<UmkmFromDB[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    // 2. Buat fungsi fetch data yang reusable
    const fetchAllData = useCallback(async (user: User) => {
        setLoading(true);
        setError(null);
        try {
            // Ambil kedua data sekaligus
            const [savedData, visitedData] = await Promise.all([
                UmkmRepository.getSavedUmkms(user.id),
                UmkmRepository.getVisitedUmkms(user.id)
            ]);
            setSavedUmkms(savedData);
            setVisitedUmkms(visitedData);
        } catch (err) {
            console.error("Gagal fetch data tab:", err);
            setError("Gagal memuat data.");
        } finally {
            setLoading(false);
        }
    }, []);

    // 3. useEffect utama untuk mengambil data dan mendaftarkan listener
    useEffect(() => {
        async function loadInitialData() {
            const user = await UserRepository.getCurrentUser();
            if (!user) {
                setError("Anda harus login untuk melihat data ini.");
                setLoading(false);
                return;
            }
            setCurrentUser(user);
            await fetchAllData(user);
        }

        loadInitialData();

        // 4. Listener tetap di sini, di induk!
        //    Ini menangani perubahan dari tempat lain (misal, HomePage)
        const cleanupListener = UmkmRepository.onVisitedDataChange(async () => {
            console.log("TabSave: Sinyal 'visited' diterima. Memuat ulang semua data...");
            const user = await UserRepository.getCurrentUser();
            if (user) {
                await fetchAllData(user);
            }
        });

        return () => {
            cleanupListener();
        };
    }, [fetchAllData]); // Sertakan fetchAllData

    // 5. Ini adalah fungsi LOGIKA UTAMA (Optimistic Update)
    const handleMoveToVisited = async (umkmToMove: UmkmFromDB) => {
        if (!currentUser) {
            alert("Sesi Anda berakhir. Silakan login kembali.");
            return;
        }

        // --- OPTIMISTIC UPDATE DIMULAI ---
        // 1. Hapus dari 'Disimpan' (state lokal)
        setSavedUmkms(prevList => 
            prevList.filter(item => item.id !== umkmToMove.id)
        );

        // 2. Tambahkan ke 'Dikunjungi' (state lokal)
        //    DAN LANGSUNG TAMBAH 'total_visits' DI CLIENT
        setVisitedUmkms(prevList => [
            { ...umkmToMove, total_visits: umkmToMove.total_visits + 1 }, 
            ...prevList
        ]);
        // --- OPTIMISTIC UPDATE SELESAI ---

        // 3. Jalankan panggilan API di latar belakang
        try {
            await UmkmRepository.moveToVisited(umkmToMove.id, currentUser.id);
            // Jika berhasil, tidak perlu melakukan apa-apa, UI sudah ter-update
            console.log("Sukses memindahkan ke 'visited' di database.");
        } catch (err) {
            console.error("Gagal memindahkan ke 'visited':", err);
            alert("Gagal memindahkan UMKM. Mengembalikan perubahan...");
            // Jika gagal, kembalikan state (rollback)
            // Ini akan memicu fetch ulang data dari server untuk sinkronisasi
            if (currentUser) {
                await fetchAllData(currentUser);
            }
        }
    };

    const tabs = [
        { id: "disimpan", label: "Umkm Disimpan" },
        { id: "dikunjungi", label: "Telah Dikunjugi" },
    ];

    const renderContent = () => {
        if (loading) return <p>Memuat data...</p>;
        if (error) return <p>{error}</p>;

        switch (activeTab) {
            case "disimpan":
                return (
                    <Disimpan 
                        savedUmkms={savedUmkms}
                        onMoveToVisited={handleMoveToVisited} // Kirim fungsi sebagai prop
                    />
                );
            case "dikunjungi":
                return (
                    <DikunjungiTabs 
                        visitedUmkms={visitedUmkms} // Kirim data sebagai prop
                    />
                );
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