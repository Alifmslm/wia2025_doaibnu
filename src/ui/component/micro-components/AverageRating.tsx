import Rating from '@mui/material/Rating';

interface AverageRatingProps {
    average: number;
    totalReviews: number;
}

function AverageRating({ average, totalReviews }: AverageRatingProps) {
    console.log(typeof average, average);
    return(
        <>
            <section className="average-rating">
                <h1>{average}</h1>
                <Rating className='rating-star' name="read-only" value={average} readOnly />
                <p>{totalReviews} Ulasan</p>
            </section>
        </>
    )
}

export default AverageRating