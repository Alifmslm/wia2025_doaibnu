import LogoWhite from '../../../assets/logo-white.png';
import BgFooter from '../../../assets/bg-footer.png';

function FooterLanding() {
    return (
        <>
            <footer className='footer-landing'>
                <div className="footer-wrapper">
                    <div className="footer-main">
                        <img src={LogoWhite} alt="" />
                        <h1>Dukung UMKM Lokal, Mulai dari Sekitar Kita.</h1>
                        <p>Platform direktori digital dimana anda bisa mengeksplor umkm sekitar</p>
                    </div>
                    <p className='copyright'>Made by Doa Ibnu Tim, 2025.</p>
                </div>
                <img src={BgFooter} alt="" className='bg-footer' />
            </footer>
        </>
    );
}

export default FooterLanding;