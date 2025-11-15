import TextField from '@mui/material/TextField';
import { useState, useEffect } from 'react'; 
import type { UserProfile, ProfileUpdateData } from "./ProfilePage";

interface ProfileInfoProps {
    user: UserProfile;
    onUpdateProfile: (data: ProfileUpdateData) => void;
    isSubmitting: boolean; 
}

function ProfileInfoPage({ user, onUpdateProfile, isSubmitting }: ProfileInfoProps) { 
    const [errors, setErrors] = useState({ name: '', email: '' }); // 'image' dihapus
    
    // 'image' dihapus dari state
    const [formData, setFormData] = useState<ProfileUpdateData>({
        name: user.name,
        email: user.email,
    });

    useEffect(() => {
        setFormData({
            name: user.name,
            email: user.email,
        });
    }, [user]);

    const validateForm = () => {
        const newErrors = { name: '', email: '' }; // 'image' dihapus
        let isValid = true;

        if (!formData.name.trim()) {
            newErrors.name = 'Nama tidak boleh kosong';
            isValid = false;
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email tidak boleh kosong';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSave = () => {
        if (isSubmitting || !validateForm()) {
            return;
        }
        onUpdateProfile(formData); // 'formData' tidak lagi berisi 'image'
        console.log('Form valid, saving...', formData);
    };

    return (
        <>
            <section className="profile-info">
                <h3 className="modal-title">Informasi Pribadi Anda</h3>
                <div className="form-profile-info">
                    <h4>Nama Anda</h4>
                    <TextField
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        label="Nama Anda"
                        variant="outlined"
                        className='input-modal'
                        error={!!errors.name}
                        helperText={errors.name}
                        disabled={isSubmitting}
                    />
                </div>
                <div className="form-profile-info">
                    <h4>Email anda</h4>
                    <TextField
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        label="Email Anda"
                        variant="outlined"
                        className='input-modal'
                        error={!!errors.email}
                        helperText={errors.email}
                        disabled={isSubmitting}
                    />
                </div>
                
                {/* --- Blok 'Profile Picture' DIHAPUS --- */}

                <button onClick={handleSave} disabled={isSubmitting}> 
                    {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
            </section>
        </>
    )
}

export default ProfileInfoPage;