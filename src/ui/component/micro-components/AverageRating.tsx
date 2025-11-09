import Rating from '@mui/material/Rating';

function AverageRating() {
    return(
        <>
            <section className="average-rating">
                <h1>4.8</h1>
                <Rating className='rating-star' name="read-only" value={4} readOnly />
                <p>120 Ulasan</p>
            </section>
        </>
    )
}

export default AverageRating