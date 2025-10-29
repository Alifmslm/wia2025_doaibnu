import ErrorIcon from '../../../assets/error-icon.png'
import SuccesIcon from '../../../assets/success-icon.png'
import WarningIcon from '../../../assets/warning-icon.png'

type FormProps = {
    nameInput: string;
    placeholderInput: string;
    isLogin: boolean;
    inputType?: string;
};

function FormInput({
    nameInput,
    placeholderInput,
    inputType = "text",
}: FormProps) {

    return (
        <section className="form_section">
            <label htmlFor={nameInput}>{nameInput}</label>

            <div className="form_input">
                <input
                    type={inputType}
                    placeholder={placeholderInput}
                    id={nameInput}
                    name={nameInput.toLowerCase()} />
                {/* Label buat email dan password salah (Login Page) */}
                <label className="label-error" htmlFor={nameInput}>
                    <img src={ErrorIcon} alt="error-icon" />
                    <p>{nameInput} anda salah!</p>
                </label>
                {/* Label buat password complexity (Register Page) */}
                {nameInput.toLowerCase() === "password" && (
                    <label className="label-password-complexity" htmlFor={nameInput}>
                        <div className="progress-container">
                            <div className="progress-bar" style={{
                                width: `30%`,
                                background: `var(--error-color)`,
                            }} />
                        </div>
                        <div className="complexity-feedback">
                            <img src={ErrorIcon} alt="error-icon" />
                            <img src={WarningIcon} alt="warning-icon" />
                            <img src={SuccesIcon} alt="success-icon" />
                            <p>{nameInput}</p>
                        </div>
                    </label>
                )}
            </div>
        </section>
    );
}

export default FormInput;