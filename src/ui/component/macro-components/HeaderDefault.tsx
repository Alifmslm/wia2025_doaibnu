import "../../../style/HeaderDefault.css";
import IconCircular from "../micro-components/IconCircular.tsx";
import LogoWia from "../../../assets/logo_wia.jpg";
import ProfileIcon from '../../../assets/profile-icon.png'
import NotificationIcon from '../../../assets/notification-icon.png'

function HeaderDefault() {
    return(
        <>
            <header className="header-home">
                <img src={LogoWia} alt="logo-web" className="logo-home" />
                <nav className="icon-group">
                    <IconCircular src={ProfileIcon} alt="search-icon"/>
                    <IconCircular src={NotificationIcon} alt="filter-icon"/>
                </nav>
            </header>
        </>
    )
}

export default HeaderDefault;