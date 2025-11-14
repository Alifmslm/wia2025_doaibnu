// SearchFilterContainer.tsx

import "../../../style/SearchFilter.css";
import Search from "../micro-components/Search.tsx";
import Filter from "../micro-components/Filter.tsx";

function SearchFilterContainer({
    searchQuery,
    onSearchChange,
    onCategorySelect,
}: {
    searchQuery: string;
    onSearchChange: (q: string) => void;
    onCategorySelect: (cat: string) => void;
}) {
    return (
        <section className="search-filter-wrapper">
            <Search
                searchQuery={searchQuery}
                onSearchChange={onSearchChange}
            />
            <Filter onCategorySelect={onCategorySelect} />
        </section>
    );
}

export default SearchFilterContainer;