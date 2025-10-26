import { useState } from "react";

type FormProps = {
    nameInput: string;
    placeholderInput: string;
    errorInput: string;
    isLogin: boolean;
    inputType?: string;
};

function FormInput({
    nameInput,
    placeholderInput,
    errorInput,
    isLogin,
    inputType = "text",
}: FormProps) {
    const [password, setPassword] = useState("");
    const [strength, setStrength] = useState("");

    // 🔹 Fungsi untuk cek kekuatan password
    const checkPasswordStrength = (value: string) => {
        if (!value) return setStrength("");

        const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        const mediumRegex = /^(?=.*[a-z])(?=.*\d).{6,}$/;

        if (strongRegex.test(value)) setStrength("kuat");
        else if (mediumRegex.test(value)) setStrength("sedang");
        else setStrength("lemah");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (inputType === "password" && !isLogin) {
            setPassword(value);
            checkPasswordStrength(value);
        }
    };

    return (
        <section className="form_section">
            <label htmlFor={nameInput}>{nameInput}</label>

            <div className="form_input">
                <input
                    type={inputType}
                    placeholder={placeholderInput}
                    id={nameInput}
                    name={nameInput.toLowerCase()}
                    onChange={handleChange}
                />

                {isLogin && errorInput && (
                    <label className="label_error" htmlFor={nameInput}>
                        <img src="" alt="error-icon" />
                        <p>{errorInput}</p>
                    </label>
                )}

                {!isLogin && inputType === "password" && (
                    <div className="password_strength">
                        {strength && (
                            <p
                                className={`strength_text ${strength}`}
                            >
                                Password anda {strength}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}

export default FormInput;