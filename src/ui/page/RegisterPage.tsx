import Form from "../component/macro-components/Form.tsx";
import HeaderAuth from "../component/micro-components/HeaderAuth.tsx";
import SideImage from "../component/micro-components/SideImage.tsx";
import "../../style/AuthPage.css";
import LogoWia from "../../assets/logo_ngulikumkm.png";

function RegisterPage() {
  return (
    <>
      <div className="auth_form">
        <SideImage />
        <section className="container_login">
          <img src={LogoWia} alt="" className="img_logo" />
          <HeaderAuth />
          <Form name="Daftar Akun" />
        </section>
      </div>
    </>
    // test
  );
}

export default RegisterPage;
