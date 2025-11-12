import { useState } from 'react';
import Logo from '../../../assets/logo.png';

function NavLanding() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="nav-landing">
            <img src={Logo} alt="logo" className="nav-img" />
            
            <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                <li><a href="/register" className='register-button'>Daftar Sekarang</a></li>
                <li><a href="/login" className='login-button'>Masuk ke Akun Anda</a></li>
            </ul>
            
            <i 
                className="fa-solid fa-bars icon-bar"
                onClick={toggleMenu} 
            ></i>
        </nav>
    );
}

export default NavLanding;