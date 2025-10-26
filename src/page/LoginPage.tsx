import Form from "../component/Form.tsx";
import HeaderAuth from "../component/HeaderAuth.tsx";
import SideImage from "../component/SideImage.tsx";
import "../style/LoginPage.css";
import LogoWia from "../assets/logo_wia.jpg";

function LoginPage() {
    return (
        <>
            <form className="auth_form">
                <SideImage/>
                <section className="container_login">
                    <img src={LogoWia} alt="" className="img_logo" />
                    <HeaderAuth />
                    <Form />
                </section>
            </form>
        </>
    );
}

export default LoginPage;
