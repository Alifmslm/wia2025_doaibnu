import TextField from '@mui/material/TextField';
import { useState } from 'react';

function ProfileInfoPage() {
    const [errors, setErrors] = useState({ name: '', email: '', image: '' });
    const [formData, setFormData] = useState({ name: '', email: '', image: null as File | null });

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
        if (!formData.image) {
            newErrors.image = 'Profile picture tidak boleh kosong';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSave = () => {
        if (validateForm()) {
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
                        value={formData.name}
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
                        value={formData.email}
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
                    <div className="" style={{marginBottom: '10px'}}>
                        <input 
                        type="file" 
                        accept="image/*" 
                        style={{marginBottom: '10px'}}
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