// Search.tsx
import SearchIcon from "../../../assets/search-icon.png";

function Search({
    searchQuery,
    onSearchChange,
}: {
    searchQuery: string;
    onSearchChange: (q: string) => void;
}) {

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        onSearchChange(e.target.value);
    };

    return (
        <section className="search-section">
            <div className="search-bar">
                <img src={SearchIcon} alt="" className="search-icon" />
                <input
                    type="text"
                    placeholder="Temukan UMKM favoritmu..."
                    value={searchQuery}
                    onChange={handleInput}
                />
            </div>
        </section>
    );
}

export default Search;