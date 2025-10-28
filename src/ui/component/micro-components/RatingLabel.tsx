import Star from "../../../assets/Star.png";

function RatingLabel() {
    return(
        <>
            <div className="rating-label">
                <img src={Star} alt="star rating" className="star-label"/>
                <p>4.8 (120)</p>
            </div>
        </>
    );
}

export default RatingLabel