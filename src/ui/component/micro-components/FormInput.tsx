// src/component/micro-components/FormInput.tsx
import React, { useState, useEffect } from 'react';
import ErrorIcon from '../../../assets/error-icon.png';
import SuccesIcon from '../../../assets/success-icon.png';
import WarningIcon from '../../../assets/warning-icon.png';

type FormProps = {
    nameInput: string;
    placeholderInput: string;
    isLogin: boolean; 
    inputType?: string;
    // [TAMBAHKAN] Props baru untuk controlled component
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

// ... Fungsi checkPasswordComplexity (tidak berubah) ...
const checkPasswordComplexity = (password: string): number => {
    // ... (kode Anda sebelumnya)
    let score = 0;
    if (!password) { return 0; }
    if (password.length >= 8) { score++; }
    if (/[A-Z]/.test(password)) { score++; }
    if (/[a-z]/.test(password)) { score++; }
    if (/[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) { score++; }
    return score;
};


function FormInput({
    nameInput,
    placeholderInput,
    inputType = "text",
    isLogin,
    // [TAMBAHKAN] Ambil props baru
    value,
    onChange,
}: FormProps) {

    // State untuk nilai input password (HANYA UNTUK KOMPLEKSITAS)
    // [PERUBAHAN] Inisialisasi state ini dari prop 'value'
    const [passwordValue, setPasswordValue] = useState<string>(value);
    
    // State untuk skor kompleksitas (0-4)
    const [complexityScore, setComplexityScore] = useState<number>(0);

    // --- Efek samping untuk menghitung kompleksitas ---
    useEffect(() => {
        if (nameInput.toLowerCase() === "password" && !isLogin) {
            // [PERUBAHAN] Gunakan 'value' dari props sebagai sumber kebenaran
            // Ini akan update setiap kali 'value' dari Form.tsx berubah
            const score = checkPasswordComplexity(value); 
            setComplexityScore(score);
            setPasswordValue(value); // Sinkronkan state internal jika perlu
        }
    }, [value, nameInput, isLogin]); // [PERUBAHAN] Bergantung pada 'value' dari props

    // ... Logika progress bar (tidak berubah) ...
    let progressBarWidth = '0%';
    let progressBarColor = 'var(--border-color)';
    let complexityFeedbackText = 'Kosong';
    let feedbackIcon = ErrorIcon; 

    if (complexityScore === 1) {
        progressBarWidth = '25%';
        progressBarColor = 'var(--error-color)'; 
        complexityFeedbackText = 'Lemah';
        feedbackIcon = ErrorIcon;
    } else if (complexityScore === 2) {
        progressBarWidth = '50%';
        progressBarColor = 'var(--warning-color)'; 
        complexityFeedbackText = 'Sedang';
        feedbackIcon = WarningIcon;
    } else if (complexityScore === 3) {
        progressBarWidth = '75%';
        progressBarColor = 'var(--main-color)'; 
        complexityFeedbackText = 'Kuat';
        feedbackIcon = SuccesIcon;
    } else if (complexityScore === 4) {
        progressBarWidth = '100%';
        progressBarColor = 'var(--main-color )'; 
        complexityFeedbackText = 'Sangat Kuat';
        feedbackIcon = SuccesIcon;
    }
    
    if (passwordValue.length === 0 && nameInput.toLowerCase() === "password" && !isLogin) {
        progressBarWidth = '0%';
        progressBarColor = 'var(--gray-color)'; 
        complexityFeedbackText = 'Masukkan Password';
        feedbackIcon = ErrorIcon;
    }

    // [PERUBAHAN] Hapus handler internal. Kita akan gunakan prop 'onChange'
    // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //    ... (Kode ini tidak lagi diperlukan karena 'onChange' datang dari props)
    // };


    // --- Rendering Komponen ---
    return (
        <section className="form_section">
            <label htmlFor={nameInput}>{nameInput}</label>

            <div className="form_input">
                <input
                    type={inputType}
                    placeholder={placeholderInput}
                    id={nameInput}
                    name={nameInput.toLowerCase()} // Ini penting untuk 'handleChange' di Form.tsx
                    
                    // [PERUBAHAN] Gunakan 'value' dan 'onChange' dari props
                    onChange={onChange}
                    value={value}
                />

                {/* 2. Label buat password complexity (Register Page) */}
                {/* Logika ini tetap ada dan tidak berubah */}
                {nameInput.toLowerCase() === "password" && !isLogin && (
                    <label className="label-password-complexity" htmlFor={nameInput}>
                        <div className="progress-container-form">
                            <div className="progress-bar" style={{
                                width: progressBarWidth,
                                background: progressBarColor,
                            }} />
                        </div>
                        <div className="complexity-feedback">
                            <img 
                                src={feedbackIcon} 
                                alt="feedback-icon" 
                            />
                            <p>{complexityFeedbackText}</p>
                        </div>
                    </label>
                )}
            </div>
        </section>
    );
}

export default FormInput;