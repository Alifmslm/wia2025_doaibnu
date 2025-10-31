import React, { useState, useEffect } from 'react';
// Asumsi path icon sudah benar
import ErrorIcon from '../../../assets/error-icon.png';
import SuccesIcon from '../../../assets/success-icon.png';
import WarningIcon from '../../../assets/warning-icon.png';

// --- Tipe Props ---

type FormProps = {
    nameInput: string;
    placeholderInput: string;
    // Gunakan isLogin untuk menentukan apakah ini halaman login atau register
    isLogin: boolean; 
    inputType?: string;
};

// --- Fungsi Utilitas Validasi Password ---

/**
 * Mengecek kompleksitas password dan mengembalikan skor 0-4.
 * 0: Kosong / Sangat Lemah
 * 1: Lemah (hanya panjang / 1 kriteria)
 * 2: Sedang (2 kriteria)
 * 3: Kuat (3 kriteria)
 * 4: Sangat Kuat (4 kriteria)
 */
const checkPasswordComplexity = (password: string): number => {
    let score = 0;

    if (!password) {
        return 0; // Password kosong
    }

    // Kriteria 1: Minimal 8 karakter
    if (password.length >= 8) {
        score++;
    }

    // Kriteria 2: Mengandung huruf kapital (uppercase)
    if (/[A-Z]/.test(password)) {
        score++;
    }

    // Kriteria 3: Mengandung huruf kecil (lowercase)
    if (/[a-z]/.test(password)) {
        score++;
    }

    // Kriteria 4: Mengandung angka atau simbol
    if (/[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
        score++;
    }

    return score;
};

// --- Komponen FormInput ---

function FormInput({
    nameInput,
    placeholderInput,
    inputType = "text",
    isLogin, // Terima prop isLogin
}: FormProps) {

    // State untuk nilai input password
    const [passwordValue, setPasswordValue] = useState<string>('');
    // State untuk skor kompleksitas (0-4)
    const [complexityScore, setComplexityScore] = useState<number>(0);

    // --- Efek samping untuk menghitung kompleksitas saat nilai password berubah ---
    useEffect(() => {
        if (nameInput.toLowerCase() === "password" && !isLogin) {
            // Hanya hitung kompleksitas jika inputnya password dan ini halaman register
            const score = checkPasswordComplexity(passwordValue);
            setComplexityScore(score);
        }
    }, [passwordValue, nameInput, isLogin]);


    // --- Logika untuk menentukan feedback visual berdasarkan skor ---

    // 1. Progress Bar Width, Background Color, dan Text
    let progressBarWidth = '0%';
    let progressBarColor = 'var(--gray-color)'; // Default saat kosong
    let complexityFeedbackText = 'Kosong';
    let feedbackIcon = ErrorIcon; // Default icon

    if (complexityScore === 1) {
        progressBarWidth = '25%';
        progressBarColor = 'var(--error-color)'; // Merah
        complexityFeedbackText = 'Lemah';
        feedbackIcon = ErrorIcon;
    } else if (complexityScore === 2) {
        progressBarWidth = '50%';
        progressBarColor = 'var(--warning-color)'; // Kuning
        complexityFeedbackText = 'Sedang';
        feedbackIcon = WarningIcon;
    } else if (complexityScore === 3) {
        progressBarWidth = '75%';
        progressBarColor = 'var(--main-color)'; // Hijau Muda
        complexityFeedbackText = 'Kuat';
        feedbackIcon = SuccesIcon;
    } else if (complexityScore === 4) {
        progressBarWidth = '100%';
        progressBarColor = 'var(--main-color )'; // Hijau Tua
        complexityFeedbackText = 'Sangat Kuat';
        feedbackIcon = SuccesIcon;
    }
    
    // Jika input kosong, skor 0, dan progress bar 0%
    if (passwordValue.length === 0) {
        progressBarWidth = '0%';
        progressBarColor = 'var(--gray-color)'; 
        complexityFeedbackText = 'Masukkan Password';
        feedbackIcon = ErrorIcon;
    }


    // Handler untuk memperbarui state saat input berubah
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Hanya update state untuk input password di halaman register
        if (nameInput.toLowerCase() === "password" && !isLogin) {
            setPasswordValue(value);
        }
        // ... Tambahkan logika penanganan input form lainnya di sini
    };


    // --- Rendering Komponen ---
    return (
        <section className="form_section">
            <label htmlFor={nameInput}>{nameInput}</label>

            <div className="form_input">
                <input
                    type={inputType}
                    placeholder={placeholderInput}
                    id={nameInput}
                    name={nameInput.toLowerCase()}
                    // Tambahkan onChange handler
                    onChange={handleInputChange}
                    // Kontrol nilai input
                    value={nameInput.toLowerCase() === "password" && !isLogin ? passwordValue : undefined}
                />
                
                {/* 1. Label buat email dan password salah (Login Page) */}
                {/* Ini harus dikontrol oleh state/prop lain, bukan hanya prop isLogin */}
                {isLogin && (
                    <label className="label-error" htmlFor={nameInput}>
                        <img src={ErrorIcon} alt="error-icon" />
                        <p>{nameInput} anda salah!</p>
                    </label>
                )}

                {/* 2. Label buat password complexity (Register Page) */}
                {nameInput.toLowerCase() === "password" && !isLogin && (
                    <label className="label-password-complexity" htmlFor={nameInput}>
                        <div className="progress-container-form">
                            {/* Progres Bar disesuaikan dengan skor */}
                            <div className="progress-bar" style={{
                                width: progressBarWidth,
                                background: progressBarColor,
                            }} />
                        </div>
                        <div className="complexity-feedback">
                            {/* Hanya satu icon yang ditampilkan, disesuaikan dengan skor */}
                            <img 
                                src={feedbackIcon} 
                                alt="feedback-icon" 
                            />

                            {/* Teks feedback disesuaikan dengan skor */}
                            <p>{complexityFeedbackText}</p>
                        </div>
                    </label>
                )}
            </div>
        </section>
    );
}

export default FormInput;