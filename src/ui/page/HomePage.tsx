// src/page/HomePage.tsx
import { useState } from "react";
import "../../style/HomePage.css";
import HeaderDefault from "../component/macro-components/HeaderDefault.tsx";
import HeroImage from "../component/macro-components/HeroImage.tsx";
import SearchFilterContainer from "../component/macro-components/SearchFilterContainer.tsx";
import UmkmList from "../component/macro-components/UmkmList.tsx";

type FilterType = "Semua" | "Terdekat" | "Hidden Gem";

function HomePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [category, setCategory] = useState("");
    const [activeFilterTab, setActiveFilterTab] = useState<FilterType>("Semua");

    const filterTabs: FilterType[] = ["Semua", "Terdekat", "Hidden Gem"];

    const handlerFilterTabClick = (filterTab: FilterType) => {
        setActiveFilterTab(filterTab);
        setSearchQuery("");
        setCategory("");
    }

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
                        onClick={() => handlerFilterTabClick(filter)}
                    >
                        <p className="">{filter}</p>
                    </div>
                ))}
            </div>
            <UmkmList activeFilter={activeFilterTab} searchQuery={searchQuery} category={category} />
        </section>
    );
}

export default HomePage;