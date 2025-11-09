interface RatingDistributionProps {
    ratings: { score: string }[];
}

function RatingDistribution({ ratings }: RatingDistributionProps) {
    const counts = [1, 2, 3, 4, 5].reduce((acc, star) => {
        acc[star] = ratings.filter(
            (r) => Math.round(parseFloat(r.score)) === star
        ).length;
        return acc;
    }, {} as Record<number, number>);

    const total = ratings.length || 1;

    const percentages = Object.fromEntries(
        Object.entries(counts).map(([star, count]) => [
            star,
            (count / total) * 100,
        ])
    );

    return (
        <div className="rating-bars">
            {Object.entries(percentages)
                .sort((a, b) => Number(b[0]) - Number(a[0]))
                .map(([rate, value]) => (
                    <div className="rating-row" key={rate}>
                        <div className="rating-bar">
                            <div
                                className="rating-fill"
                                style={{
                                    width: `${value}%`,
                                    transition: "width 0.4s ease-in-out",
                                }}
                            ></div>
                        </div>
                        <span className="rating-label">{rate}</span>
                    </div>
                ))}
        </div>
    );
}

export default RatingDistribution;