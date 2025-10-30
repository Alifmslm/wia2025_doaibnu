// src/page/HomePage.tsx
import { useState } from "react";
import "../../style/HomePage.css";
import HeaderDefault from "../component/macro-components/HeaderDefault.tsx";
import HeroImage from "../component/macro-components/HeroImage.tsx";
import SearchFilterContainer from "../component/macro-components/SearchFilterContainer.tsx";
import UmkmList from "../component/macro-components/UmkmList.tsx";

function HomePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [category, setCategory] = useState("");

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
            <UmkmList searchQuery={searchQuery} category={category} />
        </section>
    );
}

export default HomePage;