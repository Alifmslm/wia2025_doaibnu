// src/pages/LoginPage.tsx
import Form from "../component/macro-components/Form.tsx";
import HeaderAuth from "../component/micro-components/HeaderAuth.tsx";
import SideImage from "../component/micro-components/SideImage.tsx";
import "../../style/AuthPage.css";
import LogoWia from "../../assets/logo_wia.jpg";

function LoginPage() {
  return (
    <>
      <div className="auth_form"> 
        <SideImage />
        <section className="container_login">
          <img src={LogoWia} alt="" className="img_logo" />
          <HeaderAuth />
          <Form name="Login Akun" />
        </section>
      </div> 
    </>
  );
}

export default LoginPage;