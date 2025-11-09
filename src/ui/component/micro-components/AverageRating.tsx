import Rating from '@mui/material/Rating';

interface AverageRatingProps {
    average: number;
}

function AverageRating({ average }: AverageRatingProps) {
    console.log(typeof average, average);
    return(
        <>
            <section className="average-rating">
                <h1>{average}</h1>
                <Rating className='rating-star' name="read-only" value={average} readOnly />
                <p>120 Ulasan</p>
            </section>
        </>
    )
}

export default AverageRating