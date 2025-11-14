import Modal from '@mui/material/Modal';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import type { Umkm } from '../../shared/types/Umkm';

// Tipe untuk data yang di-submit dari form (disesuaikan)
export type FormEditData = {
    nama: string;
    deskripsi: string;
    kategori: string;
    lokasiGeneral: string;
    alamat: string;
    images: FileList | null;
};

interface FormEditUmkmProps {
    open: boolean;
    onClose: () => void;
    onUpdate: (data: FormEditData) => void;
    umkm: Umkm;
}

// Tipe untuk state error (disesuaikan)
type FormErrors = {
    [key in keyof Omit<FormEditData, 'images'>]?: string;
} & { images?: string };

function FormEditUmkm({ open, onClose, onUpdate, umkm }: FormEditUmkmProps) {
    // State untuk semua field form
    const [nama, setNama] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const [kategori, setKategori] = useState('');
    const [lokasiGeneral, setLokasiGeneral] = useState('');
    const [alamat, setAlamat] = useState('');
    const [images, setImages] = useState<FileList | null>(null);

    // State untuk error
    const [errors, setErrors] = useState<FormErrors>({});

    // Mengisi form dengan data UMKM saat ini
    useEffect(() => {
        if (umkm) {
            setNama(umkm.nama);
            setDeskripsi(umkm.deskripsi);
            setKategori(umkm.kategori);
            setLokasiGeneral(umkm.lokasi?.lokasi_general || '');
            setAlamat(umkm.lokasi?.alamat || '');
        }
    }, [umkm, open]);

    const handleCloseAndClear = () => {
        if (umkm) {
            setNama(umkm.nama);
            setDeskripsi(umkm.deskripsi);
            setKategori(umkm.kategori);
            setLokasiGeneral(umkm.lokasi?.lokasi_general || '');
            setAlamat(umkm.lokasi?.alamat || '');
        }
        setImages(null);
        setErrors({});
        onClose();
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        if (!nama.trim()) newErrors.nama = 'Nama UMKM tidak boleh kosong.';
        if (!deskripsi.trim()) newErrors.deskripsi = 'Deskripsi tidak boleh kosong.';
        if (!kategori.trim()) newErrors.kategori = 'Kategori tidak boleh kosong.';
        if (!lokasiGeneral.trim()) newErrors.lokasiGeneral = 'Lokasi general tidak boleh kosong.';
        if (!alamat.trim()) newErrors.alamat = 'Alamat tidak boleh kosong.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            onUpdate({
                nama,
                deskripsi,
                kategori,
                lokasiGeneral,
                alamat,
                images
            });
        }
    };

    return (
        <Modal
            open={open}
            onClose={handleCloseAndClear}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box className="modal-box" sx={{ overflowY: 'auto', maxHeight: '90vh' }}>
                <IconButton
                    aria-label="close"
                    onClick={handleCloseAndClear}
                    className="modal-close-button"
                >
                    <i className="fa-solid fa-xmark"></i>
                </IconButton>

                <h2 className="modal-title">Edit UMKM Anda</h2>

                <TextField
                    label="Nama UMKM"
                    variant="outlined"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    error={!!errors.nama}
                    helperText={errors.nama}
                    className="input-modal"
                />

                <TextField
                    label="Deskripsi UMKM"
                    variant="outlined"
                    value={deskripsi}
                    onChange={(e) => setDeskripsi(e.target.value)}
                    error={!!errors.deskripsi}
                    helperText={errors.deskripsi}
                    className="input-modal"
                    multiline
                    rows={4}
                />

                <TextField
                    label="Kategori UMKM"
                    variant="outlined"
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value)}
                    error={!!errors.kategori}
                    helperText={errors.kategori}
                    className="input-modal"
                />

                <h3 className="modal-subtitle" style={{ marginTop: '16px', marginBottom: '16px' }}>
                    Lokasi
                </h3>

                <TextField
                    label="Lokasi General (Mis: Kota, Provinsi)"
                    variant="outlined"
                    value={lokasiGeneral}
                    onChange={(e) => setLokasiGeneral(e.target.value)}
                    error={!!errors.lokasiGeneral}
                    helperText={errors.lokasiGeneral}
                    className="input-modal"
                />

                <TextField
                    label="Alamat Lengkap"
                    variant="outlined"
                    value={alamat}
                    onChange={(e) => setAlamat(e.target.value)}
                    error={!!errors.alamat}
                    helperText={errors.alamat}
                    className="input-modal"
                    multiline
                    rows={2}
                />

                <h3 className="modal-subtitle" style={{ marginTop: '16px', marginBottom: '10px' }}>
                    Upload Foto (Opsional)
                </h3>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setImages(e.target.files)}
                    className="input-modal-image"
                />

                <Button onClick={handleSubmit} variant="contained" sx={{ marginTop: '16px' }}>
                    Simpan Perubahan
                </Button>
            </Box>
        </Modal>
    );
}

export default FormEditUmkm;