import { useState, useEffect } from "react";
import "../../../style/ReviewTabs.css";
import RatingResume from "./RatingResume"; 
import RatingList, { type RatingItem } from "./RatingList"; 
import FormRating from "../micro-components/FormRating"; 
import { type User } from "@supabase/supabase-js"; // 1. Impor Tipe User
import { UmkmRepository } from "../../../data/repositories/UmkmRepository"; // 2. Impor Repo
import type { ReviewFromDB } from "../../../shared/types/Umkm";

// 3. Fungsi transform diubah untuk mengambil 'username'
function transformReviewToRatingItem(
    review: ReviewFromDB
): RatingItem {
    return {
        id: review.id, 
        // Gunakan 'username' dari 'profiles', fallback ke "Anonim"
        name: review.profiles?.username || "Anonim", 
        score: review.nilai.toFixed(1),
        desc: review.komentar || "Tidak ada komentar.",
        time: new Date(review.created_at).toLocaleDateString("id-ID"),
    };
}

// 4. Tentukan props baru
interface ReviewTabsProps {
    umkmId: number;
    reviews: ReviewFromDB[];
    isOwner: boolean;
    currentUser: User | null;
    onReviewAdded: () => void; // Fungsi untuk refresh
}

function ReviewTabs({ umkmId, reviews, isOwner, currentUser, onReviewAdded }: ReviewTabsProps) {
    const [open, setOpen] = useState(false);
    const [ratings, setRatings] = useState<RatingItem[]>([]);
    const [averageRating, setAverageRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false); // 5. State loading

    // 'useEffect' untuk memproses 'reviews' dari props
    useEffect(() => {
        if (reviews) {
            const uiRatings = reviews.map(transformReviewToRatingItem);
            setRatings(uiRatings);
        }
    }, [reviews]); 

    // 'useEffect' untuk menghitung rata-rata (tidak berubah)
    useEffect(() => {
        if (ratings.length === 0) {
            setAverageRating(0);
            return;
        }
        const total = ratings.reduce( (acc, curr) => acc + parseFloat(curr.score), 0 );
        const avg = total / ratings.length;
        setAverageRating(parseFloat(avg.toFixed(1)));
    }, [ratings]); 

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        if (!isSubmitting) setOpen(false); 
    };

    // 6. Logika untuk Cek Otorisasi (BARU)
    // Cek apakah user yang login saat ini sudah pernah memberi ulasan
    const hasUserReviewed = currentUser 
        ? reviews.some(review => review.user_id === currentUser.id)
        : false;
        
    // User bisa menambah review JIKA:
    // 1. Dia login (currentUser ada)
    // 2. Dia BUKAN pemilik (!isOwner)
    // 3. Dia BELUM pernah review (!hasUserReviewed)
    const canAddReview = currentUser && !isOwner && !hasUserReviewed;

    // 7. Modifikasi 'handleAddRating' untuk memanggil Repository
    const handleAddRating = async (newData: { rating: number; review: string }) => {
        
        if (!currentUser) {
            alert("Anda harus login untuk memberi ulasan.");
            return;
        }
        if (!canAddReview) {
            alert("Anda tidak dapat memberi ulasan (mungkin Anda pemilik atau sudah memberi ulasan).");
            return;
        }

        setIsSubmitting(true);
        try {
            // Panggil Repository!
            await UmkmRepository.addReview(
                umkmId,
                currentUser.id,
                newData.rating,
                newData.review
            );
            
            // Panggil fungsi refresh dari DetailPage
            onReviewAdded(); 
            
            handleClose(); // Tutup modal setelah sukses

        } catch (err: any) {
            console.error("Gagal menambah ulasan:", err);
            alert(`Gagal menyimpan ulasan: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <RatingResume
                onOpen={handleOpen}
                average={averageRating}
                ratings={ratings}
                canAddReview={canAddReview} // <-- Kirim status otorisasi
            />
            <hr />
            <RatingList ratings={ratings} />
            <FormRating
                open={open}
                onClose={handleClose}
                onAddRating={handleAddRating}
                isSubmitting={isSubmitting} // <-- Kirim state loading
            />
        </>
    );
}

export default ReviewTabs;