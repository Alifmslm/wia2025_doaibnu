// src/component/macro-components/Form.tsx
import React, { useState } from 'react'; // [TAMBAHKAN] Impor useState
import "../../../style/Form.css";
import FormInput from "../micro-components/FormInput.tsx";
import Button from "../micro-components/Button.tsx";
import FooterAuth from "../micro-components/FooterAuth.tsx";
// [TAMBAHKAN] Impor Repository dan ikon error
import { UserRepository } from '../../../data/repositories/UserRepository';
import ErrorIcon from '../../../assets/error-icon.png';

type FormProps = {
    name: string;
};

function Form({ name }: FormProps) {
    const isLogin = name === "Login Akun";

    // [TAMBAHKAN] State untuk menampung semua data input
    const [formData, setFormData] = useState<{ [key: string]: string }>({});
    
    // [TAMBAHKAN] State untuk menangani pesan error login
    const [loginError, setLoginError] = useState<string | null>(null);
    
    // [TAMBAHKAN] State untuk loading saat submit
    const [isLoading, setIsLoading] = useState(false);

    // daftar field & tipe input-nya
    const fields = isLogin
        ? [
            { label: "Email", type: "email" },
            { label: "Password", type: "password" }
        ]
        : [
            { label: "Nama", type: "text" },
            { label: "Email", type: "email" },
            { label: "Password", type: "password" }
        ];

    const footerText = isLogin
        ? { name: "Belum punya akun?", subname: "Daftar Sekarang!", link: "/register" }
        : { name: "Sudah punya akun?", subname: "Masuk Sekarang!", link: "/login" };

    // [TAMBAHKAN] Handler untuk memperbarui state saat input berubah
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value // 'name' di sini adalah 'email', 'password', 'nama'
        }));
        
        // Hapus error jika pengguna mulai mengetik lagi
        if (isLogin) {
            setLoginError(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isLogin) {
            setIsLoading(true);
            setLoginError(null);
            
            const email = formData.email || '';
            const password = formData.password || '';

            try {
                // Panggil fungsi login dari repository
                const user = await UserRepository.login(email, password);

                if (user) {
                    window.location.href = '/home';
                } else {
                    // Jika user null (login gagal)
                    setLoginError("Email atau password yang Anda masukkan salah!");
                }
            } catch (error) {
                console.error("Login error:", error);
                setLoginError("Terjadi kesalahan. Silakan coba lagi.");
            } finally {
                setIsLoading(false);
            }

        } else {
            // --- Logika untuk Register ---
            setIsLoading(true);
            console.log("Mendaftarkan user dengan data:", formData);
            setIsLoading(false);
        }
    };

    return (
        // [PERUBAHAN] Ganti <section> dengan <form> dan tambahkan onSubmit
        <form className="section_form_parent" onSubmit={handleSubmit}>
            {fields.map((field) => (
                <FormInput
                    key={field.label}
                    nameInput={field.label}
                    placeholderInput={`Masukan ${field.label.toLowerCase()} anda...`}
                    inputType={field.type}
                    isLogin={isLogin}
                    
                    value={formData[field.label.toLowerCase()] || ''}
                    onChange={handleChange}
                />
            ))}

            {/* [TAMBAHKAN] Tampilkan pesan error global di atas tombol */}
            {isLogin && loginError && (
                <div className="label-error">
                    <img src={ErrorIcon} alt="error-icon" />
                    <p>{loginError}</p>
                </div>
            )}

            <Button 
                nameButton={isLoading ? 'Loading...' : name} 
                cekLogin={isLogin}
            />

            <FooterAuth
                name={footerText.name}
                subname={footerText.subname}
                link={footerText.link}
            />
        </form>
    );
}

export default Form;