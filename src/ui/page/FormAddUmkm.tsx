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
    const [isSubmitting, setIsSubmitting] = useState(false); // <-- State loading BARU

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
     * (DIMODIFIKASI TOTAL)
     */
    const handleStepTwoSubmit = async (dataFromStepTwo: MenuItem[]) => {
        // Simpan data menu final ke state
        setMenuItems(dataFromStepTwo);
        setIsSubmitting(true); // <-- Mulai loading

        try {
            // 1. Dapatkan user yang sedang login
            const user = await UserRepository.getCurrentUser();
            if (!user) {
                alert("Sesi Anda telah berakhir. Silakan login kembali.");
                setIsSubmitting(false);
                navigate('/login'); // Arahkan ke login
                return;
            }

            // 2. Cek validasi file (FormInfoUmkm sudah melakukan ini, tapi
            //    ini adalah 'double check' yang baik)
            if (umkmData.gallery.length === 0) {
                 alert("Anda harus meng-upload minimal 1 foto UMKM di Langkah 1.");
                 setIsSubmitting(false);
                 setStep(1); // Kembalikan ke step 1
                 return;
            }

            console.log("=== MEMULAI PROSES UPLOAD DAN SUBMIT ===");
            console.log("Data Info UMKM:", umkmData);
            console.log("Data Menu:", dataFromStepTwo);
            console.log("Owner ID:", user.id);

            // 3. Panggil Repository
            // Repository akan menangani semua proses upload file
            await UmkmRepository.addMyUmkm(
                umkmData,         // Mengandung File[]
                dataFromStepTwo,  // Mengandung File | null
                user.id
            );

            console.log("=== DATA UMKM FINAL BERHASIL DIKIRIM ===");
            
            alert("Pendaftaran UMKM Berhasil!");
            navigate('/profile'); // Arahkan kembali ke halaman profil

        } catch (error) {
            console.error("Gagal total saat submit UMKM:", error);
            if (error instanceof Error) {
                alert(`Terjadi kesalahan: ${error.message}`);
            } else {
                alert("Terjadi kesalahan yang tidak diketahui. Coba lagi.");
            }
        } finally {
            setIsSubmitting(false); // Selesai loading, apa pun hasilnya
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
                        disabled={isSubmitting} // <-- Nonaktifkan saat submit
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

                    {/* Tampilkan pesan loading jika sedang submit di step 2 */}
                    {isSubmitting && step === 2 && (
                        <div className="loading-overlay" style={{ textAlign: 'center', padding: '40px' }}>
                            <p><strong>Sedang meng-upload gambar dan menyimpan data...</strong> <br/> Mohon tunggu, ini mungkin perlu waktu beberapa saat.</p>
                            {/* Anda bisa tambahkan spinner CSS di sini */}
                        </div>
                    )}

                    {/* Wrapper untuk menonaktifkan form saat loading */}
                    <div style={{ display: isSubmitting ? 'none' : 'block' }}>
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
                                isSubmitting={isSubmitting} // <-- Kirim prop loading
                            />
                        )}
                    </div>

                </div>
            </section>
        </>
    );
}

export default FormAddUmkm;