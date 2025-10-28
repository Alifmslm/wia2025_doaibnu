import "../../../style/SearchFilter.css";
import Search from "../micro-components/Search.tsx";
import Filter from "../micro-components/Filter.tsx";

function SearchFilterContainer() {
    return(
        <>
            <section className="search-filter-wrapper">
                <Search/>
                <Filter/>
            </section>
        </>
    )
}

export default SearchFilterContainer;