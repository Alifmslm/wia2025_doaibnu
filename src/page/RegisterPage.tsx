import Form from "../component/Form.tsx";
import HeaderAuth from "../component/HeaderAuth.tsx";
import SideImage from "../component/SideImage.tsx";
import "../style/AuthPage.css";
import LogoWia from "../assets/logo_wia.jpg";

function RegisterPage() {
    return (
        <>
            <form className="auth_form">
                <SideImage/>
                <section className="container_login">
                    <img src={LogoWia} alt="" className="img_logo" />
                    <HeaderAuth />
                    <Form name="Daftar Akun"/>
                </section>
            </form>
        </>
        // test
    );
}

export default RegisterPage;