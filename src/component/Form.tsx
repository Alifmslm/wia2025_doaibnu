import '../style/Form.css'
import FormInput from "./FormInput.tsx";
import Button from "./Button.tsx";
import FooterAuth from "./FooterAuth.tsx";

function Form() {
    return(
        <>
            <section className='section_form_parent'>
                <FormInput/>
                <FormInput/>
                <Button />
                <FooterAuth />
            </section>
        </>
    )
}

export default Form