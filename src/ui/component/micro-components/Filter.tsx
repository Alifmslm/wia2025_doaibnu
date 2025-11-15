import { useState } from "react";
import PopUpFilter from "../micro-components/PopupFilter.tsx";
import FilterIcon from "../../../assets/filter-icon.png";

// 1. Tambahkan 'categories' ke tipe props
interface FilterProps {
    onCategorySelect: (cat: string) => void;
    categories: string[]; // <-- TAMBAHKAN INI
}

function Filter({ onCategorySelect, categories }: FilterProps) { // <-- 2. Terima props
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button className="button-filter" onClick={() => setIsOpen(true)}>
                <img src={FilterIcon} alt="filter-icon" className="filter-icon" />
            </button>

            {isOpen && (
                <PopUpFilter
                    onClose={() => setIsOpen(false)}
                    onCategorySelect={onCategorySelect}
                    categories={categories} // <-- 3. Teruskan ke PopUpFilter
                />
            )}
        </>
    );
}

export default Filter;