import "../style/Form.css";
import FormInput from "./FormInput.tsx";
import Button from "./Button.tsx";
import FooterAuth from "./FooterAuth.tsx";

type FormProps = {
    name: string;
};

function Form({ name }: FormProps) {
    const isLogin = name === "Login Akun";

    // daftar field & tipe input-nya
    const fields = isLogin
        ? [
            { label: "Email", type: "email" },
            { label: "Password", type: "password" }
        ]
        : [
            { label: "Nama", type: "text" },
            { label: "Email", type: "email" },
            { label: "Password", type: "password" }
        ];

    const footerText = isLogin
        ? { name: "Belum punya akun?", subname: "Daftar Sekarang!", link: "/register" }
        : { name: "Sudah punya akun?", subname: "Masuk Sekarang!", link: "/login" };

    return (
        <section className="section_form_parent">
            {fields.map((field) => (
                <FormInput
                    key={field.label}
                    nameInput={field.label}
                    placeholderInput={`Masukan ${field.label.toLowerCase()} anda...`}
                    inputType={field.type}
                    isLogin={isLogin}
                    errorInput=""
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