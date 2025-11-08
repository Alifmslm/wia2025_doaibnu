import UmkmFavoritCard from "./UmkmFavoritCard";
import "../../../style/UmkmFavorit.css";

function UmkmFavorit() {
    return (
        <>
            <section className="umkm-favorit">
                <div className="umkm-favorit__header">
                    <h1>Penuh dengan UMKM Terbaik!</h1>
                    <p>Inilah daftar usaha yang paling diminati dan direkomendasikan oleh pelanggan di sekitar Anda.</p>
                </div>
                <div className="outer">
                    <div className="umkm-favorit__carousell">
                        <UmkmFavoritCard isOff={false} />
                        <UmkmFavoritCard isOff={true} />
                        <UmkmFavoritCard isOff={true} />
                        <UmkmFavoritCard isOff={true} />
                        <UmkmFavoritCard isOff={true} />
                        <UmkmFavoritCard isOff={true} />
                        <UmkmFavoritCard isOff={true} />
                        <UmkmFavoritCard isOff={true} />
                        <UmkmFavoritCard isOff={true} />
                    </div>
                </div>
                <div className="umkm-favorit__button">
                    <button className="carousel-btn btn-prev"><i className="fa-solid fa-chevron-left"></i></button>
                    <button className="carousel-btn btn-next"><i className="fa-solid fa-chevron-right"></i></button>
                </div>
            </section>
        </>
    )
}

export default UmkmFavorit;