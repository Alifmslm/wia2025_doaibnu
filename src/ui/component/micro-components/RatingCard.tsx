import Star from "../../../assets/Star.png";

type RatingCardProps = {
    name: string;
    score: string;
    desc: string;
    time: string;
};

function RatingCard({ name, score, desc, time }: RatingCardProps) {
    return (
        <div className="rating-card">
            <div className="header-rate">
                <h1>{name}</h1>
                <div className="rate">
                    <img src={Star} alt="Star" />
                    <p>{score}</p>
                </div>
            </div>
            <p className="desc-rate">{desc}</p>
            <p className="rate-time">{time}</p>
        </div>
    );
}

export default RatingCard;
