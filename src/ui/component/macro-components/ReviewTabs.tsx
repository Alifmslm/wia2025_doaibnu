// src/component/macro-components/ReviewTabs.tsx
import { useState, useEffect } from "react";
import "../../../style/ReviewTabs.css";
import RatingResume from "./RatingResume"; // Asumsi path
import RatingList, { type RatingItem } from "./RatingList"; // Asumsi path
import FormRating from "../micro-components/FormRating"; // Asumsi path

// 1. Impor tipe data BARU
import type { ReviewFromDB } from "../../../shared/types/Umkm";

// 2. Fungsi transform diubah untuk menerima ReviewFromDB
function transformReviewToRatingItem(
    review: ReviewFromDB
): RatingItem {
    return {
        id: review.id, 
        // Tampilkan 8 karakter pertama dari user_id sebagai nama
        name: review.user_id ? review.user_id.substring(0, 8) + '...' : "Anonim", 
        score: review.nilai.toFixed(1),
        desc: review.komentar || "Tidak ada komentar.",
        time: new Date(review.created_at).toLocaleDateString("id-ID"), // Format tanggal
    };
}

// 3. Tentukan props
interface ReviewTabsProps {
    umkmId: number;
    reviews: ReviewFromDB[];
}

function ReviewTabs({ umkmId, reviews }: ReviewTabsProps) {
    const [open, setOpen] = useState(false);
    const [ratings, setRatings] = useState<RatingItem[]>([]);
    const [averageRating, setAverageRating] = useState(0);

    // 4. Hapus 'useEffect' yang mem-fetch getById
    //    Ganti dengan 'useEffect' yang memproses 'reviews' dari props
    useEffect(() => {
        if (reviews) {
            const uiRatings = reviews.map(transformReviewToRatingItem);
            setRatings(uiRatings);
        }
    }, [reviews]); // Bergantung pada 'reviews' dari props

    // (useEffect untuk menghitung averageRating sudah benar)
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
    }, [ratings]); 

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleAddRating = (newData: { rating: number; review: string }) => {
        // TODO: Ganti ini dengan memanggil UmkmRepository.addReview(umkmId, newData)
        // Setelah berhasil, fetch ulang data atau tambahkan ke state secara optimis
        
        console.log("Review baru (belum terkirim):", newData);
        const newRating: RatingItem = {
            id: new Date().getTime(),
            name: "Anda (Baru)",
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