import { useState } from "react";
import "../../style/HomePage.css";
import HeaderDefault from "../component/macro-components/HeaderDefault.tsx";
import HeroImage from "../component/macro-components/HeroImage.tsx";
import SearchFilterContainer from "../component/macro-components/SearchFilterContainer.tsx";
import UmkmList from "../component/macro-components/UmkmList.tsx";

type FilterType = "Semua" | "Terdekat" | "Hidden Gem";

type UserLocation = {
    latitude: number;
    longitude: number;
};

function HomePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [category, setCategory] = useState("");
    const [activeFilterTab, setActiveFilterTab] = useState<FilterType>("Semua");
    const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
    const [geoLoading, setGeoLoading] = useState(false);
    const [geoError, setGeoError] = useState<string | null>(null);

    const filterTabs: FilterType[] = ["Semua", "Terdekat", "Hidden Gem"];
    const filterCategories = ['Indonesia', 'Asia', 'Western', 'Lain-lain'];


    // ====================================================================
    // 1. HANDLER KATEGORI (handleCategorySelect)
    // Logika: Memilih kategori dan mengunci filter.
    // ====================================================================
    const handleCategorySelect = (selectedCategory: string) => {
        // Jika kategori dipilih atau di-reset, kategori diatur.
        // TIDAK ADA RESET activeFilterTab di sini.
        setCategory(selectedCategory);

        // Opsional: Jika Anda ingin kembali ke tab "Semua" setelah memilih kategori baru:
        // setActiveFilterTab("Semua");
    }


    // ====================================================================
    // 2. HANDLER TAB (handleFilterTabClick)
    // Logika: Hanya mengubah jenis tab, mempertahankan kategori.
    // ====================================================================
    const handleFilterTabClick = (filterTab: FilterType) => {

        setActiveFilterTab(filterTab);

        // Logika Geolocation (tetap sama)
        if (filterTab === "Terdekat") {
            if (userLocation) return;
            if (!("geolocation" in navigator)) {
                setGeoError("Geolocation tidak didukung oleh browser Anda.");
                return;
            }
            setGeoLoading(true);
            setGeoError(null);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                    setGeoLoading(false);
                },
                (error) => {
                    const errorMsg =
                        error.code === 1
                            ? "Izin lokasi ditolak."
                            : "Gagal mendapatkan lokasi.";
                    setGeoError(errorMsg);
                    setGeoLoading(false);
                }
            );
        }
    };

    return (
        <section className="home-section">
            <HeaderDefault />
            <div className="hero-container">
                <HeroImage />
                <SearchFilterContainer
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onCategorySelect={handleCategorySelect} // Menggunakan handler baru
                    categories={filterCategories}
                />
            </div>
            <div className="filter-rekomendasi">
                {filterTabs.map((filter) => (
                    <div
                        key={filter}
                        className={
                            activeFilterTab === filter
                                ? "button-filter-rekomendasi-on"
                                : "button-filter-rekomendasi-off"
                        }
                        onClick={() => handleFilterTabClick(filter)}
                    >
                        <p>{filter}</p>
                    </div>
                ))}
            </div>
            <UmkmList
                activeFilter={activeFilterTab}
                searchQuery={searchQuery}
                category={category} // Category (Indonesia, dll.) dikirim ke UmkmList
                userLocation={userLocation}
                geoLoading={geoLoading}
                geoError={geoError}
            />
        </section>
    );
}

export default HomePage;