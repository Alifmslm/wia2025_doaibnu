import { useState } from "react";
import PopUpFilter from "../micro-components/PopupFilter.tsx";

function Filter() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button 
                className="button-filter" 
                onClick={() => setIsOpen(true)}
            >
                <img src="" alt="filter-icon" className="filter-icon" />
            </button>

            {isOpen && (
                <PopUpFilter onClose={() => setIsOpen(false)} />
            )}
        </>
    );
}

export default Filter;
