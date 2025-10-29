function RatingDistribution() {
    const ratings = {
        5: 80,
        4: 60,
        3: 40,
        2: 20,
        1: 10,
    };

    return (
        <div className="rating-bars">
            {Object.entries(ratings)
                .sort((a, b) => Number(b[0]) - Number(a[0])) // urut dari 5 → 1
                .map(([rate, value]) => (
                    <div className="rating-row" key={rate}>
                        <div className="rating-bar">
                            <div
                                className="rating-fill"
                                style={{ width: `${value}%` }}
                            ></div>
                        </div>
                        <span className="rating-label">{rate}</span>
                    </div>
                ))}
        </div>
    );
}

export default RatingDistribution