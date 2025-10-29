import Star from "../../../assets/Star.png"

function RatingCard() {
    return(
        <>
            <div className="rating-card">
                <div className="header-rate">
                    <h1>Bu Carti</h1>
                    <div className="rate">
                        <img src={Star} alt="" />
                        <p>4.8</p>
                    </div>
                </div>
                <p className="desc-rate">Lorem ipsum dolor sit amet consectetur. Nunc nunc phasellus elit sed non. Consequat non curabitur tempus faucibus.</p>
                <p className="rate-time">1 Minggu yang Lalu</p>
            </div>
        </>
    )
}

export default RatingCard