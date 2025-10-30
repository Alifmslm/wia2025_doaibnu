import { useState } from "react";
import SearchIcon from "../../../assets/search-icon.png";

function Search({ onSearchChange }: { onSearchChange: (q: string) => void }) {
    const [value, setValue] = useState("");

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setValue(val);
        onSearchChange(val);
    };

    return (
        <section className="search-section">
            <div className="search-bar">
                <img src={SearchIcon} alt="" className="search-icon" />
                <input
                    type="text"
                    placeholder="Temukan UMKM favoritmu..."
                    value={value}
                    onChange={handleInput}
                />
            </div>
        </section>
    );
}

export default Search;