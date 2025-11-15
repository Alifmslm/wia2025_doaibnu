// src/component/macro-components/HeaderDefault.tsx
import "../../../style/HeaderDefault.css";
import IconCircular from "../micro-components/IconCircular.tsx";
import LogoWia from "../../../assets/logo_ngulikumkm.png";
import ProfileIcon from '../../../assets/profile-icon.png'
import NotificationIcon from '../../../assets/notification-icon.png'
import SaveIcon from '../../../assets/save_icon.png'
import { Link } from "react-router-dom"; // 1. Impor Link

function HeaderDefault() {
    return(
        <>
            <header className="header-home">
                {/* 2. Ganti <a> dengan <Link> */}
                <Link to="/home">
                    <img src={LogoWia} alt="logo-web" className="logo-home" />
                </Link>
                <nav className="icon-group">
                    {/* Pastikan path IconCircular benar dan file-nya ada */}
                    <IconCircular src={SaveIcon} alt="filter-icon" url="/save-page"/>
                    <IconCircular src={ProfileIcon} alt="search-icon" url="/profile"/>
                    <IconCircular src={NotificationIcon} alt="filter-icon" url="/notification"/>
                </nav>
            </header>
        </>
    )
}

export default HeaderDefault;