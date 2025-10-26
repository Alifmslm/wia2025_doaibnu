import '../style/Form.css'
import FormInput from "./FormInput.tsx";
import Button from "./Button.tsx";
import FooterAuth from "./FooterAuth.tsx";

type FormProps ={
    name: string;
}

function Form({name}:FormProps) {
    return(
        <>
            <section className='section_form_parent'>
                <FormInput nameInput='Email' placeholderInput='Masukan email anda...'/>
                <FormInput nameInput='Password' placeholderInput='Masukan password anda...'/>
                <Button nameButton={name}/>
                <FooterAuth />
            </section>
        </>
    )
}

export default Form