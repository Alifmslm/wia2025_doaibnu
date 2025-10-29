import FilterContainer from "../macro-components/FilterContainer";
import { createPortal } from "react-dom";
import Button from "./Button.tsx";

type PopUpFilterProps = {
    onClose: () => void; // ✅ terima fungsi penutup dari parent
};

function PopUpFilter({ onClose }: PopUpFilterProps) {
    return createPortal(
        <>
            <div className="popup-overlay" onClick={onClose}>
                <div
                    className="popup-content"
                    onClick={(e) => e.stopPropagation()} // cegah klik di dalam popup menutup popup
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
