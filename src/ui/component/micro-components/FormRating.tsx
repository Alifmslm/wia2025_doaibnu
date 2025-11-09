import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton'; // Ganti Button dengan IconButton

interface FormRatingProps {
    open: boolean;
    onClose: () => void;
}

function FormRating({ open, onClose }: FormRatingProps) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box className="modal-box">
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    className="modal-close-button"
                >
                    <i className="fa-solid fa-xmark"></i>
                </IconButton>

                <h2 id="modal-title">My Modal Title</h2>
                <p id="modal-description">
                    This is the content displayed inside the modal.
                </p>
            </Box>
        </Modal>
    );
}

export default FormRating;