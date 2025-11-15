import "../../../style/SearchFilter.css";
import Search from "../micro-components/Search.tsx";
import Filter from "../micro-components/Filter.tsx";

// 1. Tambahkan 'categories' ke tipe props
interface SearchFilterContainerProps {
    searchQuery: string;
    onSearchChange: (q: string) => void;
    onCategorySelect: (cat: string) => void;
    categories: string[]; // <-- TAMBAHKAN INI
}

function SearchFilterContainer({
    searchQuery,
    onSearchChange,
    onCategorySelect,
    categories // <-- 2. Terima props di sini
}: SearchFilterContainerProps) { // <-- 3. Gunakan tipe baru
    return (
        <section className="search-filter-wrapper">
            <Search
                searchQuery={searchQuery}
                onSearchChange={onSearchChange}
            />
            <Filter 
                onCategorySelect={onCategorySelect} 
                categories={categories} // <-- 4. Teruskan ke Filter
            />
        </section>
    );
}

export default SearchFilterContainer;