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

    const handleFilterTabClick = (filterTab: FilterType) => {
        setActiveFilterTab(filterTab);
        setSearchQuery("");
        setCategory("");

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
                    onSearchChange={setSearchQuery}
                    onCategorySelect={setCategory}
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
                category={category}
                userLocation={userLocation}
                geoLoading={geoLoading}
                geoError={geoError}
            />
        </section>
    );
}

export default HomePage;
