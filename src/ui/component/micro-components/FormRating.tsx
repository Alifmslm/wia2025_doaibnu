import Modal from '@mui/material/Modal';
import { useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { ratingValidation } from '../../../shared/utils/validator/RatingValidation';

interface FormRatingProps {
    open: boolean;
    onClose: () => void;
    onAddRating: (newData: { rating: number, review: string }) => void;
    isSubmitting: boolean; // <-- 1. Terima prop loading
}

// 2. Terima 'isSubmitting'
function FormRating({ open, onClose, onAddRating, isSubmitting }: FormRatingProps) {
    const [rating, setRating] = useState('');
    const [review, setReview] = useState('');
    const [ratingError, setRatingError] = useState('');
    const [reviewError, setReviewError] = useState('');

    const handleCloseAndClear = () => {
        if (isSubmitting) return; // Jangan tutup saat loading
        setRating('');
        setReview('');
        setRatingError('');
        setReviewError('');
        onClose();
    };

    const handleSubmit = () => {
        if (isSubmitting) return; // Jangan submit ganda

        const newRatingError = ratingValidation(rating);
        const newReviewError = review.trim() === '' ? 'Review tidak boleh kosong.' : '';

        setRatingError(newRatingError);
        setReviewError(newReviewError);

        if (newRatingError === '' && newReviewError === '') {
            onAddRating({
                rating: Number(rating),
                review: review,
            });
            // Kita tidak tutup modal di sini.
            // Biarkan 'ReviewTabs' yang menutupnya setelah submit berhasil.
        }
    };
    return (
        <Modal
            open={open}
            onClose={handleCloseAndClear}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box className="modal-box">
                {/* 3. Nonaktifkan semua field saat loading */}
                <fieldset disabled={isSubmitting} style={{ border: 'none', padding: 0, margin: 0 }}>
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseAndClear}
                        className="modal-close-button"
                        disabled={isSubmitting} // <-- Nonaktifkan
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </IconButton>

                    <h2 className="modal-title">Tulis Ulasan Anda</h2>
                    <TextField 
                        id="outlined" 
                        label="Rating yang anda berikan (0.0 - 5.0)" 
                        variant="outlined" 
                        value={rating} 
                        onChange={(e) => setRating(e.target.value)} 
                        error={!!ratingError} 
                        helperText={ratingError} 
                        className='input-modal'
                        disabled={isSubmitting} // <-- Nonaktifkan
                    />
                    <TextField 
                        id="outlined-multiline-flexible" 
                        label="Review Anda" 
                        variant="outlined" 
                        className='input-modal' 
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        error={!!reviewError}
                        helperText={reviewError}
                        multiline
                        disabled={isSubmitting} // <-- Nonaktifkan
                    />
                </fieldset>
                
                <Button 
                    onClick={handleSubmit} 
                    variant="contained" 
                    disabled={isSubmitting} // <-- Nonaktifkan
                >
                    {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
            </Box>
        </Modal>
    );
}

export default FormRating;