import RatingDistribution from "../micro-components/RatingDistribution"
import AverageRating from "../micro-components/AverageRating"
import PenIcon from "../../../assets/pen-icon.png"

interface RatingResumeProps {
    onOpen: () => void;
}

function RatingResume({ onOpen }: RatingResumeProps) {
    return (
        <>
            <h1 className="title-review">Ringkasan Ulasan</h1>
            <section className="rating-resume">
                <RatingDistribution />
                <AverageRating />
            </section>
            <div className="add-review">
                <img src={PenIcon} alt="pen-icon" />
                <button
                    className="button-add-review"
                    onClick={onOpen}
                >
                    Tulis Ulasan Anda
                </button>
            </div>
        </>
    )
}

export default RatingResume;