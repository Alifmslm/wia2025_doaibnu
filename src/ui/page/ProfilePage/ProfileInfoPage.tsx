import TextField from '@mui/material/TextField';
import { useState, useEffect } from 'react'; // 1. Import useEffect
// 2. Import tipe data dari file ProfilePage
import type { UserProfile, ProfileUpdateData } from "./ProfilePage";

// 3. Definisikan props yang akan diterima
interface ProfileInfoProps {
    user: UserProfile;
    onUpdateProfile: (data: ProfileUpdateData) => void;
}

function ProfileInfoPage({ user, onUpdateProfile }: ProfileInfoProps) { // 4. Terima props
    const [errors, setErrors] = useState({ name: '', email: '', image: '' });
    
    // 5. Gunakan state lokal untuk form, diinisialisasi dari props
    const [formData, setFormData] = useState<ProfileUpdateData>({
        name: user.name,
        email: user.email,
        image: null as File | null
    });

    // 6. Sinkronkan state form jika props 'user' berubah
    useEffect(() => {
        setFormData({
            name: user.name,
            email: user.email,
            image: null // Reset pilihan file saat data induk berubah
        });
    }, [user]);

    const validateForm = () => {
        const newErrors = { name: '', email: '', image: '' };
        let isValid = true;

        if (!formData.name.trim()) {
            newErrors.name = 'Nama tidak boleh kosong';
            isValid = false;
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email tidak boleh kosong';
            isValid = false;
        }
        // Saya hapus validasi gambar agar tidak wajib diisi setiap simpan
        // if (!formData.image) {
        //     newErrors.image = 'Profile picture tidak boleh kosong';
        //     isValid = false;
        // }

        setErrors(newErrors);
        return isValid;
    };

    const handleSave = () => {
        if (validateForm()) {
            // 7. Panggil fungsi update dari props dengan data form saat ini
            onUpdateProfile(formData);
            console.log('Form valid, saving...', formData);
        }
    };

    return (
        <>
            <section className="profile-info">
                <h3 className="modal-title">Informasi Pribadi Anda</h3>
                <div className="form-profile-info">
                    <h4>Nama Anda</h4>
                    <TextField
                        value={formData.name} // 8. Gunakan state form
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        label="Nama Anda"
                        variant="outlined"
                        className='input-modal'
                        error={!!errors.name}
                        helperText={errors.name}
                    />
                </div>
                <div className="form-profile-info">
                    <h4>Email anda</h4>
                    <TextField
                        value={formData.email} // 9. Gunakan state form
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        label="Email Anda"
                        variant="outlined"
                        className='input-modal'
                        error={!!errors.email}
                        helperText={errors.email}
                    />
                </div>
                <div className="form-profile-info">
                    <h4>Profile Picture</h4>
                    <div className="" style={{ marginBottom: '10px' }}>
                        <input
                            type="file"
                            accept="image/*"
                            style={{ marginBottom: '10px' }}
                            onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                            className="input-modal-image"
                        />
                        {errors.image && <span style={{ color: 'red' }}>{errors.image}</span>}
                    </div>
                </div>
                <button onClick={handleSave}>Simpan Perubahan</button>
            </section>
        </>
    )
}

export default ProfileInfoPage;