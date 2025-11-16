import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderDefault from '../component/macro-components/HeaderDefault';
import '../../style/FormAddUmkm.css'; 
import type { UmkmFormData, MenuItem } from '../../shared/types/Umkm';
import FormInfoUmkm from './FormInfoUmkm';
import FormMenuAdd from './FormMenuAdd';

// --- Impor Repository (BARU) ---
import { UmkmRepository } from '../../data/repositories/UmkmRepository';
import { UserRepository } from '../../data/repositories/UserRepository'; // Asumsi Anda punya ini

function FormAddUmkm() {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false); 

    // === State Utama untuk Data Final ===
    const [umkmData, setUmkmData] = useState<UmkmFormData>({
        nama: '',
        kategori: '',
        deskripsi: '',
        lokasiGeneral: '',
        linkGmaps: '',
        gallery: [],
        alamatLengkap: '', // <-- TAMBAHKAN INI
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
    const handleStepTwoSubmit = async (dataFromStepTwo: MenuItem[]) => {
        setMenuItems(dataFromStepTwo);
        setIsSubmitting(true); 

        try {
            // 1. Dapatkan user yang sedang login
            const user = await UserRepository.getCurrentUser();
            if (!user) {
                alert("Sesi Anda telah berakhir. Silakan login kembali.");
                setIsSubmitting(false);
                navigate('/login'); 
                return;
            }

            // 2. Cek validasi file
            if (umkmData.gallery.length === 0) {
                 alert("Anda harus meng-upload minimal 1 foto UMKM di Langkah 1.");
                 setIsSubmitting(false);
                 setStep(1); 
                 return;
            }

            console.log("=== MEMULAI PROSES UPLOAD DAN SUBMIT ===");
            console.log("Data Info UMKM:", umkmData);
            console.log("Data Menu:", dataFromStepTwo);
            console.log("Owner ID:", user.id);

            // 3. Panggil Repository
            await UmkmRepository.addMyUmkm(
                umkmData,
                dataFromStepTwo,
                user.id
            );

            console.log("=== DATA UMKM FINAL BERHASIL DIKIRIM ===");
            
            alert("Pendaftaran UMKM Berhasil!");
            navigate('/profile'); 

        } catch (error) {
            console.error("Gagal total saat submit UMKM:", error);
            if (error instanceof Error) {
                alert(`Terjadi kesalahan: ${error.message}`);
            } else {
                alert("Terjadi kesalahan yang tidak diketahui. Coba lagi.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <HeaderDefault />
            <section className="add-umkm-page">
                <div className="form-container">
                    
                    <button 
                        onClick={() => navigate(-1)} 
                        className="back-button-page"
                        disabled={isSubmitting} 
                    >
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

                    {isSubmitting && step === 2 && (
                        <div className="loading-overlay" style={{ textAlign: 'center', padding: '40px' }}>
                            <p><strong>Sedang meng-upload gambar dan menyimpan data...</strong> <br/> Mohon tunggu, ini mungkin perlu waktu beberapa saat.</p>
                        </div>
                    )}

                    <div style={{ display: isSubmitting ? 'none' : 'block' }}>
                        {step === 1 && (
                            <FormInfoUmkm 
                                initialData={umkmData}
                                onSubmit={handleStepOneSubmit}
                            />
                        )}
                        {step === 2 && (
                            <FormMenuAdd
                                initialData={menuItems}
                                onSubmit={handleStepTwoSubmit}
                                onBack={() => setStep(1)}
                                isSubmitting={isSubmitting} 
                            />
                        )}
                    </div>

                </div>
            </section>
        </>
    );
}

export default FormAddUmkm;