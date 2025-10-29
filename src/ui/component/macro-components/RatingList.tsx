import '../../../style/RatingList.css'
import RatingCard from '../micro-components/RatingCard'

function RatingList() {
    return (
        <>
            <section className="rating-list-container">
                <h1>Ulasan</h1>
                <section className="rating-list">
                    <RatingCard />
                    <RatingCard />
                    <RatingCard />
                </section>
            </section>

        </>
    )
}

export default RatingList