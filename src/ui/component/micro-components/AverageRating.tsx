import Star from "../../../assets/Star.png";

function AverageRating() {
    return(
        <>
            <section className="average-rating">
                <h1>4.8</h1>
                <div className="star-container">
                    <img src={Star} alt="" />
                    <img src={Star} alt="" />
                    <img src={Star} alt="" />
                    <img src={Star} alt="" />
                </div>
                <p>120 Ulasan</p>
            </section>
        </>
    )
}

export default AverageRating