type FormProps = {
    nameInput: string;
    placeholderInput: string;
}

function FormInput({nameInput, placeholderInput}:FormProps ) {
    return(
        <>
            <section className='form_section'>
                <label htmlFor="">{nameInput}</label>
                <div className="form_input">
                    <input type="email" placeholder={placeholderInput}/>
                    <label className="label_error" htmlFor="">
                        <img src="" alt="" />
                        <p>Email yang anda masukan tidak ditemukan.</p>
                    </label>
                </div>
            </section>
        </>
    )
}

export default FormInput