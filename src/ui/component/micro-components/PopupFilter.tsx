import FilterContainer from "../macro-components/FilterContainer.tsx";

function PopUpFilter() {
    return (
        <>
            <div className="popup-overlay">
                <div className="popup-content">
                    <div className="close-button"></div>
                    <h1>Pilih Filter</h1>
                    <FilterContainer/>
                    <FilterContainer/>
                </div>
            </div>
        </>
    );
}

export default PopUpFilter;