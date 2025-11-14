import Modal from '@mui/material/Modal';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import type { Umkm } from '../../shared/types/Umkm';

// --- Impor tambahan untuk Dropdown (Select) ---
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
// ----------------------------------------------

// Tipe untuk data yang di-submit dari form (disesuaikan)
export type FormEditData = {
    nama: string;
    deskripsi: string;
    kategori: string; // Tipe 'string' tetap dipertahankan agar kompatibel
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
    const [kategori, setKategori] = useState(''); // State ini akan digunakan oleh Select
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
        // Validasi untuk kategori (Select)
        if (!kategori.trim()) newErrors.kategori = 'Kategori wajib dipilih.';
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

    // Handler khusus untuk Select component
    const handleKategoriChange = (event: SelectChangeEvent) => {
        setKategori(event.target.value as string);
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

                {/* === INI BAGIAN YANG DIUBAH === */}
                <FormControl
                    variant="outlined"
                    className="input-modal"
                    error={!!errors.kategori}
                >
                    <InputLabel id="kategori-select-label">Kategori UMKM</InputLabel>
                    <Select
                        labelId="kategori-select-label"
                        id="kategori-select"
                        value={kategori}
                        onChange={handleKategoriChange}
                        label="Kategori UMKM" // Diperlukan agar label outlined-nya rapi
                    >
                        {/* Opsi yang diminta */}
                        <MenuItem value="Indonesia">Indonesia</MenuItem>
                        <MenuItem value="Western">Western</MenuItem>
                        <MenuItem value="Asia">Asia</MenuItem>
                        <MenuItem value="Lain-lain">Lain-lain</MenuItem>
                    </Select>
                    {/* Tampilkan helper text jika ada error */}
                    {errors.kategori && <FormHelperText>{errors.kategori}</FormHelperText>}
                </FormControl>
                {/* === AKHIR BAGIAN YANG DIUBAH === */}

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