import FilterContainer from "../macro-components/FilterContainer";
import { createPortal } from "react-dom";
// Hapus 'Button' karena tidak diperlukan lagi
// import Button from "./Button.tsx";

// 1. Tambahkan 'categories' ke tipe props
type PopUpFilterProps = {
    onClose: () => void;
    onCategorySelect: (cat: string) => void;
    categories: string[]; // <-- Terima prop dari Filter.tsx
};

// 2. Terima 'categories' di sini
function PopUpFilter({ onClose, onCategorySelect, categories }: PopUpFilterProps) {

    // 3. Buat handler baru
    //    Ini akan memilih kategori DAN menutup modal dalam satu klik
    const handleCategoryClick = (category: string) => {
        onCategorySelect(category); // Kirim kategori ke HomePage
        onClose(); // Tutup modal
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

                    {/* 4. Gunakan 'categories' dari props */}
                    <FilterContainer
                        title="Kategori UMKM"
                        labels={categories} // <-- Gunakan prop
                        onLabelClick={handleCategoryClick} // <-- Gunakan handler baru
                    />
                </div>
            </div>
        </>,
        document.body
    );
}

export default PopUpFilter;