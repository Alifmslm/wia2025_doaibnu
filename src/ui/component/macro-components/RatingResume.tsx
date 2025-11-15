import RatingDistribution from "../micro-components/RatingDistribution";
import AverageRating from "../micro-components/AverageRating";
import PenIcon from "../../../assets/pen-icon.png";
import { type RatingItem } from "./RatingList";

interface RatingResumeProps {
    onOpen: () => void;
    average: number;
    ratings: RatingItem[];
    canAddReview: boolean; // <-- 1. Terima prop baru
}

// 2. Terima 'canAddReview' dari props
function RatingResume({ onOpen, average, ratings, canAddReview }: RatingResumeProps) {
    return (
        <>
            <h1 className="title-review">Ringkasan Ulasan</h1>
            <section className="rating-resume">
                <RatingDistribution ratings={ratings} />
                <AverageRating average={average} totalReviews={ratings.length} />
            </section>
            
            {/* 3. Tampilkan tombol HANYA jika 'canAddReview' true */}
            {canAddReview && (
                <div className="add-review">
                    <img src={PenIcon} alt="pen-icon" />
                    <button className="button-add-review" onClick={onOpen}>
                        Tulis Ulasan Anda
                    </button>
                </div>
            )}
        </>
    );
}

export default RatingResume;