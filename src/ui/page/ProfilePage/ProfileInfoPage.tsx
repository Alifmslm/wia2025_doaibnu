import TextField from '@mui/material/TextField';

function ProfileInfoPage() {
    return (
        <>
            <section className="profile-info">
                <h3 className="modal-title">Informasi Pribadi Anda</h3>
                <div className="form-profile-info">
                    <h4>Nama Anda</h4>
                    <TextField id="outlined" label="Alif Muslim Abdurrahman" variant="outlined" className='input-modal' />
                </div>
                <div className="form-profile-info">
                    <h4>Email anda</h4>
                    <TextField id="outlined" label="alifmslm01@gmail.com" variant="outlined" className='input-modal' />
                </div>
                <div className="form-profile-info">
                    <h4>Profile Picture</h4>
                    <input type="file" accept="image/*" className="input-modal-image" />
                </div>
                <button>Simpan Perubahan</button>
            </section>
        </>
    )
}

export default ProfileInfoPage;