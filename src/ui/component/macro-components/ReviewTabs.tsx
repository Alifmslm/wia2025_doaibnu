import { useState } from "react";
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

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleAddRating = (newData: { rating: number, review: string }) => {
        const newRating: RatingItem = {
            id: new Date().getTime(),
            name: "Pengguna Anonim",
            score: newData.rating.toFixed(1),
            desc: newData.review,
            time: "Baru saja",
        };

        setRatings(prevRatings => [newRating, ...prevRatings]);
    };

    return (
        <>
            <RatingResume onOpen={handleOpen} />

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