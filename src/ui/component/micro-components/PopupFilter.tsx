import FilterContainer from "../macro-components/FilterContainer";
import { createPortal } from "react-dom";
import { useState } from "react"; // Tambahkan useState untuk melacak pilihan sementara

// 1. Tambahkan 'categories' ke tipe props
type PopUpFilterProps = {
    onClose: () => void;
    onCategorySelect: (cat: string) => void;
    categories: string[]; 
};

function PopUpFilter({ onClose, onCategorySelect, categories }: PopUpFilterProps) {
    // State lokal untuk melacak kategori yang dipilih saat ini di dalam popup
    const [selectedCategory, setSelectedCategory] = useState<string>("");

    // Handler yang dipanggil saat label di FilterContainer diklik
    const handleLabelClick = (category: string) => {
        // Simpan pilihan sementara, tetapi jangan terapkan filter sampai tombol 'Terapkan' diklik
        setSelectedCategory(category);
    };

    // Handler yang dipanggil saat tombol 'Terapkan Filter' diklik
    const handleApplyFilter = () => {
        onCategorySelect(selectedCategory);
        onClose();
    };
    
    // Handler yang dipanggil saat tombol 'Reset Filter' diklik
    const handleResetFilter = () => {
        // Kirim string kosong ("") atau null untuk menunjukkan reset
        onCategorySelect(""); 
        setSelectedCategory(""); // Reset pilihan lokal
        onClose();
    };

    return createPortal(
        <>
            <div className="popup-overlay" onClick={onClose}>
                <div
                    className="popup-content"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Tombol X */}
                    <p className="close-popup-btn" onClick={onClose}>
                        X
                    </p>

                    <h1>Pilih Filter</h1>

                    {/* Filter Kategori */}
                    <FilterContainer
                        title="Kategori UMKM"
                        labels={categories}
                        // Gunakan state lokal untuk melacak pilihan
                        selectedLabel={selectedCategory} 
                        onLabelClick={handleLabelClick}
                    />

                    {/* --- KONTROL TOMBOL BARU --- */}
                    <div className="popup-actions">
                        <button 
                            className="reset-btn" 
                            onClick={handleResetFilter} // Panggil handler reset
                        >
                            Reset Filter
                        </button>
                        <button 
                            className="apply-btn" 
                            onClick={handleApplyFilter} // Panggil handler terapkan
                        >
                            Terapkan Filter
                        </button>
                    </div>
                    {/* --------------------------- */}

                </div>
            </div>
        </>,
        document.body
    );
}

export default PopUpFilter;