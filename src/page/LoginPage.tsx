import Form from "../component/Form.tsx";
import Button from "../component/Button.tsx";
import HeaderAuth from "../component/HeaderAuth.tsx";
import "../style/LoginPage.css";
import LogoWia from "../assets/logo_wia.jpg";

function LoginPage() {
    return(
        <>
            <section className="container_login">
                <img src={LogoWia} alt="" className="img_logo"/>
                <HeaderAuth/>
                <Form/>
                <Button/>
            </section>
        </>
    )
}

export default LoginPage