import '../style/Form.css'

function FormInput() {
    return(
        <>
            <section className='form_section'>
                <label htmlFor="">Email</label>
                <input type="email" placeholder='Masukan email anda...'/>
            </section>
        </>
    )
}

export default FormInput