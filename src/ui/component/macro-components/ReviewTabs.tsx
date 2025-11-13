import { useState, useEffect } from "react";
import "../../../style/ReviewTabs.css";
import RatingResume from "./RatingResume";
import RatingList, { type RatingItem } from "./RatingList";
import FormRating from "../micro-components/FormRating";

import { UmkmRepository } from "../../../data/repositories/UmkmRepository";
import type { Rating as UmkmRating } from "../../../shared/types/Umkm";

function transformUmkmRatingToRatingItem(
    umkmRating: UmkmRating,
    index: number
): RatingItem {
    return {
        id: index, 
        name: umkmRating.user,
        score: umkmRating.nilai.toFixed(1),
        desc: umkmRating.komentar || "Tidak ada komentar.",
        time: "Beberapa waktu lalu",
    };
}

interface ReviewTabsProps {
    umkmId: number;
}

function ReviewTabs({ umkmId }: ReviewTabsProps) {
    const [open, setOpen] = useState(false);

    // 5. Inisialisasi state sebagai kosong
    const [ratings, setRatings] = useState<RatingItem[]>([]);
    const [averageRating, setAverageRating] = useState(0);

    useEffect(() => {
        async function loadRatingData() {
            const umkm = await UmkmRepository.getById(umkmId);
            if (umkm && umkm.ratings) {
                const uiRatings = umkm.ratings.map(transformUmkmRatingToRatingItem);
                setRatings(uiRatings);
            }
        }
        loadRatingData();
    }, [umkmId]);

    useEffect(() => {
        if (ratings.length === 0) {
            setAverageRating(0);
            return;
        }

        const total = ratings.reduce(
            (acc, curr) => acc + parseFloat(curr.score),
            0
        );
        const avg = total / ratings.length;
        setAverageRating(parseFloat(avg.toFixed(1)));
    }, [ratings]); // <-- Kunci: Bergantung pada state 'ratings'

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
            <RatingResume
                onOpen={handleOpen}
                average={averageRating}
                ratings={ratings}
            />
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