import { useState, useEffect } from "react";
import "../../../style/ReviewTabs.css";
import RatingResume from "./RatingResume";
import RatingList, { type RatingItem } from "./RatingList";
import FormRating from "../micro-components/FormRating";

const INITIAL_RATINGS: RatingItem[] = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    score: (Math.random() * 5).toFixed(1),
    desc: "Lorem ipsum dolor sit amet consectetur. Nunc nunc phasellus elit sed non.",
    time: `${i + 1} hari yang lalu`,
}));

function ReviewTabs() {
    const [open, setOpen] = useState(false);
    const [ratings, setRatings] = useState<RatingItem[]>(INITIAL_RATINGS);
    const [averageRating, setAverageRating] = useState(0);

    // 🔹 Hitung rata-rata setiap kali ratings berubah
    useEffect(() => {
        if (ratings.length === 0) {
            setAverageRating(0);
            return;
        }

        const total = ratings.reduce((acc, curr) => acc + parseFloat(curr.score), 0);
        const avg = total / ratings.length;
        setAverageRating(parseFloat(avg.toFixed(1)));
    }, [ratings]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleAddRating = (newData: { rating: number; review: string }) => {
        const newRating: RatingItem = {
            id: new Date().getTime(),
            name: "Pengguna Anonim",
            score: newData.rating.toFixed(1),
            desc: newData.review,
            time: "Baru saja",
        };

        setRatings((prevRatings) => [newRating, ...prevRatings]);
    };

    return (
        <>
            {/* 🔹 Kirim averageRating ke komponen RatingResume */}
            <RatingResume onOpen={handleOpen} average={averageRating} />

            <hr />

            <RatingList ratings={ratings} />

            <FormRating
                open={open}
                onClose={handleClose}
                onAddRating={handleAddRating}
            />
        </>
    );
}

export default ReviewTabs;
