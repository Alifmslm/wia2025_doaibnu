import FilterContainer from "../macro-components/FilterContainer";
import { createPortal } from "react-dom";
import Button from "./Button.tsx";

type PopUpFilterProps = {
    onClose: () => void;
    onCategorySelect: (cat: string) => void;
};


function PopUpFilter({ onClose, onCategorySelect }: PopUpFilterProps) {
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

                    {/* Filter 1 */}
                    <FilterContainer
                        title="Filter Populer"
                        labels={["Terpopuler", "Terdekat", "Termurah", "Terbaik"]}
                    />

                    <hr className="divider" />

                    {/* Filter 2 */}
                    <FilterContainer
                        title="Kategori UMKM"
                        labels={["Makanan", "Minuman", "Jasa"]}
                        onLabelClick={onCategorySelect} // ✅ panggil dari sini
                    />

                    {/* Tombol Simpan */}
                    <Button nameButton="Simpan Filter" onClick={onClose} />
                </div>
            </div>
        </>,
        document.body
    );
}

export default PopUpFilter;
