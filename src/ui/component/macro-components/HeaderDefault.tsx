import "../../../style/HeaderDefault.css";
import IconCircular from "../micro-components/IconCircular.tsx";
import LogoWia from "../../../assets/logo_wia.jpg";

function HeaderDefault() {
    return(
        <>
            <header className="header-home">
                <img src={LogoWia} alt="logo-web" className="logo-home" />
                <nav className="icon-group">
                    <IconCircular />
                    <IconCircular />
                </nav>
            </header>
        </>
    )
}

export default HeaderDefault;