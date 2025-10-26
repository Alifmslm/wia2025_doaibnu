import "../style/Form.css";
import FormInput from "./FormInput.tsx";
import Button from "./Button.tsx";
import FooterAuth from "./FooterAuth.tsx";

type FormProps = {
    name: string;
};

function Form({ name }: FormProps) {
    const isLogin = name === "Login Akun";

    const fields = isLogin
        ? ["Email", "Password"]
        : ["Nama", "Email", "Password"];

    const footerText = isLogin
        ? { name: "Belum punya akun?", subname: "Daftar Sekarang!", link: "/register" }
        : { name: "Sudah punya akun?", subname: "Masuk Sekarang!", link: "/login" };

    return (
        <section className="section_form_parent">
            {fields.map((field) => (
                <FormInput
                    key={field}
                    nameInput={field}
                    placeholderInput={`Masukan ${field.toLowerCase()} anda...`}
                />
            ))}

            <Button nameButton={name} />

            <FooterAuth
                name={footerText.name}
                subname={footerText.subname}
                link={footerText.link}
            />
        </section>
    );
}

export default Form;
