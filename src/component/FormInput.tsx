function FormInput() {
    return(
        <>
            <section className='form_section'>
                <label htmlFor="">Email</label>
                <div className="form_input">
                    <input type="email" placeholder='Masukan email anda...'/>
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