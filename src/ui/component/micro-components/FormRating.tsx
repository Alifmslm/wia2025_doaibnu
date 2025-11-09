import Modal from '@mui/material/Modal';
import { useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { ratingValidation } from '../../../shared/utils/validator/ratingvalidation';

interface FormRatingProps {
    open: boolean;
    onClose: () => void;
    onAddRating: (newData: { rating: number, review: string }) => void;
}

function FormRating({ open, onClose, onAddRating }: FormRatingProps) {
    const [rating, setRating] = useState('');
    const [review, setReview] = useState('');

    const [ratingError, setRatingError] = useState('');
    const [reviewError, setReviewError] = useState('');

    const handleCloseAndClear = () => {
        setRating('');
        setReview('');
        setRatingError('');
        setReviewError('');
        onClose();
    };

    const handleSubmit = () => {
        const newRatingError = ratingValidation(rating);
        const newReviewError = review.trim() === '' ? 'Review tidak boleh kosong.' : '';

        setRatingError(newRatingError);
        setReviewError(newReviewError);

        if (newRatingError === '' && newReviewError === '') {
            onAddRating({
                rating: Number(rating),
                review: review,
            });
            handleCloseAndClear();
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
                <IconButton
                    aria-label="close"
                    onClick={handleCloseAndClear}
                    className="modal-close-button"
                >
                    <i className="fa-solid fa-xmark"></i>
                </IconButton>

                <h2 className="modal-title">Tulis Ulasan Anda</h2>
                <TextField id="outlined" label="Rating yang anda berikan (0.0 - 5.0)" variant="outlined" value={rating} 
                        onChange={(e) => setRating(e.target.value)} error={!!ratingError} helperText={ratingError} 
                        className='input-modal' />
                <TextField id="outlined-multiline-flexible" label="Review Anda" 
                            variant="outlined" 
                            className='input-modal' 
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            error={!!reviewError}
                            helperText={reviewError}
                            multiline />
                <Button onClick={handleSubmit} variant="contained">Submit</Button>
            </Box>
        </Modal>
    );
}

export default FormRating;