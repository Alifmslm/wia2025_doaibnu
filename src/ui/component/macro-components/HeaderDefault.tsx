import "../../../style/HeaderDefault.css";
import IconCircular from "../micro-components/IconCircular.tsx";
import LogoWia from "../../../assets/logo_wia.jpg";
import ProfileIcon from '../../../assets/profile-icon.png'
import NotificationIcon from '../../../assets/notification-icon.png'
import SaveIcon from '../../../assets/save_icon.png'

function HeaderDefault() {
    return(
        <>
            <header className="header-home">
                <a href="/home">
                    <img src={LogoWia} alt="logo-web" className="logo-home" />
                </a>
                <nav className="icon-group">
                    <IconCircular src={SaveIcon} alt="filter-icon" url="/save-page"/>
                    <IconCircular src={ProfileIcon} alt="search-icon" url="/profile"/>
                    <IconCircular src={NotificationIcon} alt="filter-icon" url="/notification"/>
                </nav>
            </header>
        </>
    )
}

export default HeaderDefault;