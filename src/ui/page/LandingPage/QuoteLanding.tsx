import "../../../style/QuoteLanding.css";

function QuoteLanding() {
    return (
        <>
            <section className="quote-landing">
                <div className="quote-header">
                    <h1>Ditemukan & Menemukan</h1>
                    <p>Tempat di mana UMKM dan pelanggan saling bertemu</p>
                </div>

                <div className="quote-carousel-wrapper">
                    <div className="quote-carousel">
                        <div className="quote-carousel__item"></div>
                        <div className="quote-carousel__item"></div>
                        <div className="quote-carousel__item"></div>
                        <div className="quote-carousel__item"></div>
                        <div className="quote-carousel__item"></div>
                        <div className="quote-carousel__item"></div>
                    </div>
                </div>

                <div className="quote-testimonial">
                    <p className="quote-text">"Baru tanu, banyak banget UMKM unik dan kreatif di sini.!"</p>
                    <p className="quote-author">Maulana Aditya</p>
                    <p className="quote-author-desc">Pengguna Setia, Sejak 2024</p>
                </div>

                <div className="quote-buttons">
                    <button className="carousel-btn btn-prev"><i className="fa-solid fa-chevron-left"></i></button>
                    <button className="carousel-btn btn-next"><i className="fa-solid fa-chevron-right"></i></button>
                </div>
            </section>
        </>
    )
}

export default QuoteLanding;