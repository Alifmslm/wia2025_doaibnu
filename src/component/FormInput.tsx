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
                    name={nameInput.toLowerCase()}/>
                    {/* Label buat email dan password salah (Login Page) */}
                    <label className="label-error" htmlFor={nameInput}>
                        <img src="" alt="error-icon" />
                        <p>{nameInput} anda salah!</p>
                    </label>
                    {/* Label buat email dan password salah (Login Page) */}
                    <label className="label-error" htmlFor={nameInput}>
                        <img src="" alt="error-icon" />
                        <p>{nameInput} anda salah!</p>
                    </label>
            </div>
        </section>
    );
}

export default FormInput;