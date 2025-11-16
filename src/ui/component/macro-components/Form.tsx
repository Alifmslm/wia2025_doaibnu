// File: src/component/macro-components/Form.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Impor useNavigate
import "../../../style/Form.css";
import FormInput from "../micro-components/FormInput.tsx";
import Button from "../micro-components/Button.tsx";
import FooterAuth from "../micro-components/FooterAuth.tsx";
import { UserRepository } from '../../../data/repositories/UserRepository';
import ErrorIcon from '../../../assets/error-icon.png';

type FormProps = {
    name: string;
};

function Form({ name }: FormProps) {
    const isLogin = name === "Login Akun";
    const navigate = useNavigate(); // 2. Gunakan hook navigasi

    const [formData, setFormData] = useState<{ [key: string]: string }>({"email": "", "password": "", "nama": ""});
    const [globalError, setGlobalError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fields = isLogin
        ? [
            { label: "Email", type: "email" },
            { label: "Password", type: "password" }
        ]
        : [
            { label: "Nama", type: "text" }, // 'Nama' ini akan jadi 'username'
            { label: "Email", type: "email" },
            { label: "Password", type: "password" }
        ];

    const footerText = isLogin
        ? { name: "Belum punya akun?", subname: "Daftar Sekarang!", link: "/register" }
        : { name: "Sudah punya akun?", subname: "Masuk Sekarang!", link: "/login" };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value 
        }));
        setGlobalError(null); // Hapus error saat mengetik
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setGlobalError(null);
        
        const email = formData.email;
        const password = formData.password;

        if (isLogin) {
            // --- Logika LOGIN ---
            try {
                const { user, error } = await UserRepository.login(email, password);
                if (error) throw error;

                if (user) {
                    navigate('/home'); // 3. Gunakan 'navigate'
                } else {
                    setGlobalError("Email atau password salah.");
                }
            } catch (error: any) {
                console.error("Login error:", error);
                setGlobalError(error.message || "Email atau password salah.");
            }
        } else {
            // --- Logika REGISTER ---
            const username = formData.nama; // Ambil 'nama' sebagai username
            try {
                const { user, error } = await UserRepository.register(email, password, username);
                if (error) throw error;
                
                if (user) {
                    // Tampilkan pesan untuk cek email (jika konfirmasi diaktifkan)
                    alert("Pendaftaran berhasil! Silakan cek email Anda untuk konfirmasi.");
                    navigate('/login'); // Arahkan ke login setelah daftar
                }
            } catch (error: any) {
                console.error("Register error:", error);
                setGlobalError(error.message || "Gagal mendaftar. Coba lagi.");
            }
        }
        
        setIsLoading(false); // Selesai loading
    };

    return (
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

            {globalError && (
                <div className="label-error">
                    <img src={ErrorIcon} alt="error-icon" />
                    <p>{globalError}</p>
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