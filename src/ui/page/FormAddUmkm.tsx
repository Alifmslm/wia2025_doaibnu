import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderDefault from '../component/macro-components/HeaderDefault';
import '../../style/FormAddUmkm.css'; 
import type { UmkmFormData, MenuItem } from '../../shared/types/Umkm';
import FormInfoUmkm from './FormInfoUmkm';
import FormMenuAdd from './FormMenuAdd';

function FormAddUmkm() {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);

    // === State Utama untuk Data Final ===
    const [umkmData, setUmkmData] = useState<UmkmFormData>({
        nama: '',
        kategori: '',
        deskripsi: '',
        lokasiGeneral: '',
        linkGmaps: '',
        gallery: [],
    });
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    
    /**
     * Menerima data dari Step 1, menyimpannya, dan lanjut ke Step 2
     */
    const handleStepOneSubmit = (dataFromStepOne: UmkmFormData) => {
        console.log("Data UMKM (Step 1) Lolos Validasi:", dataFromStepOne);
        setUmkmData(dataFromStepOne);
        setStep(2);
    };

    /**
     * Menerima data dari Step 2, menggabungkan semua data, dan submit
     */
    const handleStepTwoSubmit = (dataFromStepTwo: MenuItem[]) => {
        // Simpan data menu final
        setMenuItems(dataFromStepTwo);

        // Gabungkan semua data untuk dikirim (menggunakan umkmData dari state)
        const finalData = {
            infoUmkm: umkmData, // Data dari step 1
            menu: dataFromStepTwo, // Data dari step 2
        };

        console.log("=== DATA UMKM FINAL SIAP DIKIRIM ===");
        console.log(JSON.stringify(finalData, null, 2));
        
        // Tampilkan nama file (karena File object tidak bisa di-JSON.stringify)
        console.log("File Galeri UMKM:", umkmData.gallery.map(f => f.name));
        console.log("File Menu:", dataFromStepTwo.map(m => m.fotoProduk?.name));

        alert("Pendaftaran UMKM Berhasil!");
        // Arahkan kembali ke halaman profil atau list UMKM
        navigate('/profile'); 
    };

    return (
        <>
            <HeaderDefault />
            <section className="add-umkm-page">
                <div className="form-container">
                    
                    <button onClick={() => navigate(-1)} className="back-button-page">
                        <i className="fa-solid fa-chevron-left"></i> Kembali ke Profil
                    </button>

                    <div className="form-header">
                        <h2>{step === 1 ? 'Langkah 1: Informasi UMKM' : 'Langkah 2: Informasi Menu'}</h2>
                        <div className="step-indicator">
                            <span className={step === 1 ? 'active' : 'completed'}>1</span>
                            <div className={`step-line ${step === 2 ? 'active' : ''}`}></div>
                            <span className={step === 2 ? 'active' : ''}>2</span>
                        </div>
                    </div>

                    {/* Render Komponen Step 1 */}
                    {step === 1 && (
                        <FormInfoUmkm 
                            initialData={umkmData}
                            onSubmit={handleStepOneSubmit}
                        />
                    )}

                    {/* Render Komponen Step 2 */}
                    {step === 2 && (
                        <FormMenuAdd
                            initialData={menuItems}
                            onSubmit={handleStepTwoSubmit}
                            onBack={() => setStep(1)}
                        />
                    )}

                </div>
            </section>
        </>
    );
}

export default FormAddUmkm;