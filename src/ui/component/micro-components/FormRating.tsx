import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

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

                <h2 className="modal-title">Tulis Ulasan Anda</h2>
                <TextField id="outlined-multiline-flexible" label="Rating yang anda berikan" variant="outlined" multiline className='input-modal' />
                <TextField id="outlined-multiline-flexible" label="Review Anda" variant="outlined" className='input-modal' multiline/>
                <Button onClick={onClose} variant="contained">Submit</Button>
            </Box>
        </Modal>
    );
}

export default FormRating;