interface isOffProps {
    isOff: boolean;
}

function UmkmFavoritCard({isOff}: isOffProps) {
    return (
        <>
            <div className={`umkm-card ${isOff ? "off-card" : ""}`}>
                <div className="category-label">
                    <i className="fa-solid fa-utensils"></i>
                    <p>Makanan</p>
                </div>
                <h2 className="umkm-name">Pecel lele Bu Ayu</h2>
            </div>
        </>
    )
}

export default UmkmFavoritCard;