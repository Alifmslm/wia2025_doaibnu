import Star from "../../../assets/Star.png";

type RatingLabelProps = {
    rating: number;      // nilai rating rata-rata
    total?: number;      // opsional: jumlah penilai
};

function RatingLabel({ rating, total }: RatingLabelProps) {
    return (
        <div className="rating-label-home">
            <img src={Star} alt="star rating" className="star-label" />
            <p>
                {rating.toFixed(1)}{total ? ` (${total})` : ""}
            </p>
        </div>
    );
}

export default RatingLabel;