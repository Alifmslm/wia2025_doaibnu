import { useState } from "react";
import PopUpFilter from "../micro-components/PopupFilter.tsx";
import FilterIcon from "../../../assets/filter-icon.png";

function Filter({ onCategorySelect }: { onCategorySelect: (cat: string) => void }) {
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
                />
            )}
        </>
    );
}

export default Filter;