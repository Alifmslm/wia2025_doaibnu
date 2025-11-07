import Logo from '../../../assets/logo.png';

function NavLanding() {
    return (
        <nav className="nav-landing">
            <img src={Logo} alt="logo" className="nav-img"/>
            <ul className="nav-links">
                <li><a href="/register" className='register-button'>Daftar Sekarang</a></li>
                <li><a href="/login" className='login-button'>Masuk ke Akun Anda</a></li>
            </ul>
            <i className="fa-solid fa-bars icon-bar" ></i>
        </nav>
    );
}

export default NavLanding;