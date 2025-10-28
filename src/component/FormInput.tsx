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
                    <label className="label_error" htmlFor={nameInput}>
                        <img src="" alt="error-icon" />
                        <p>{errorInput}</p>
                    </label>
            </div>
        </section>
    );
}

export default FormInput;