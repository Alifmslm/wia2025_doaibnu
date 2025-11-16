import { useState, type ChangeEvent, type FormEvent } from 'react';
import type { UmkmFormData } from '../../shared/types/Umkm';

// Props yang diterima dari Induk
interface FormInfoUmkmProps {
    initialData: UmkmFormData;
    onSubmit: (data: UmkmFormData) => void;
}

function FormInfoUmkm({ initialData, onSubmit }: FormInfoUmkmProps) {
    const [umkmData, setUmkmData] = useState<UmkmFormData>(initialData);

    const handleUmkmChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUmkmData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    /**
     * Menangani perubahan pada input file
     */
    const handleUmkmFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            // Ubah FileList menjadi array dan simpan di state
            setUmkmData(prev => ({
                ...prev,
                gallery: Array.from(e.target.files!),
            }));
        }
    };

    /**
     * Menjalankan validasi dan mengirim data ke induk jika lolos
     */
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        
        // Validasi ketat untuk semua field
        if (umkmData.nama.trim() === '') {
            alert("Nama UMKM wajib diisi.");
            return;
        }
        if (umkmData.kategori === '') {
            alert("Jenis Makanan wajib dipilih.");
            return;
        }
        if (umkmData.gallery.length === 0) {
            alert("Anda wajib mengunggah minimal satu foto UMKM.");
            return;
        }
        if (umkmData.deskripsi.trim() === '') {
            alert("Deskripsi wajib diisi.");
            return;
        }
        if (umkmData.lokasiGeneral.trim() === '') {
            alert("Lokasi General wajib diisi.");
            return;
        }
        
        // --- VALIDASI BARU ---
        if (umkmData.alamatLengkap.trim() === '') {
            alert("Alamat Lengkap wajib diisi.");
            return;
        }
        // --- AKHIR VALIDASI BARU ---
        
        if (umkmData.linkGmaps.trim() === '') {
            alert("Link Google Maps wajib diisi.");
            return;
        }

        // Jika semua lolos validasi, panggil prop onSubmit
        onSubmit(umkmData);
    };

    return (
        <form onSubmit={handleSubmit} className="umkm-form">
            
            <div className="form-group">
                <label htmlFor="nama">Nama UMKM</label>
                <input
                    type="text"
                    id="nama"
                    name="nama"
                    value={umkmData.nama}
                    onChange={handleUmkmChange}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="kategori">Jenis Makanan</label>
                <select
                    id="kategori"
                    name="kategori"
                    value={umkmData.kategori}
                    onChange={handleUmkmChange}
                    required
                >
                    <option value="" disabled>Pilih Kategori</option>
                    <option value="Indonesia">Indonesia</option>
                    <option value="Asia">Asia</option>
                    <option value="Western">Western</option>
                    <option value="Lain-lain">Lain-lain</option>
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="gallery">Foto UMKM (Bisa lebih dari satu)</label>
                <input
                    type="file"
                    id="gallery"
                    name="gallery"
                    onChange={handleUmkmFileChange}
                    multiple 
                    accept="image/*"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="deskripsi">Deskripsi</label>
                <textarea
                    id="deskripsi"
                    name="deskripsi"
                    value={umkmData.deskripsi}
                    onChange={handleUmkmChange}
                    rows={4}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="lokasiGeneral">Lokasi General (Contoh: Jakarta Selatan)</label>
                <input
                    type="text"
                    id="lokasiGeneral"
                    name="lokasiGeneral"
                    value={umkmData.lokasiGeneral}
                    onChange={handleUmkmChange}
                    required
                />
            </div>

            {/* --- FORM GROUP BARU --- */}
            <div className="form-group">
                <label htmlFor="alamatLengkap">Alamat Lengkap</label>
                <textarea
                    id="alamatLengkap"
                    name="alamatLengkap"
                    value={umkmData.alamatLengkap}
                    onChange={handleUmkmChange}
                    rows={3}
                    placeholder="Contoh: Jl. Merdeka No. 17, RT 05/RW 02, Kel. Cempaka..."
                    required
                />
            </div>
            {/* --- AKHIR FORM GROUP BARU --- */}

            <div className="form-group">
                <label htmlFor="linkGmaps">Link Google Maps</label>
                <input
                    type="url"
                    id="linkGmaps"
                    name="linkGmaps"
                    value={umkmData.linkGmaps}
                    onChange={handleUmkmChange}
                    placeholder="https://maps.app.goo.gl/..."
                    required
                />
            </div>

            <div className="form-navigation">
                <button type="submit" className="button-primary-add">Lanjut ke Tambah Menu</button>
            </div>
        </form>
    );
}

export default FormInfoUmkm;