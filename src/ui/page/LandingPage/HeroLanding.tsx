import BgLanding1 from '../../../assets/bg-landing-1.png';
import BgLanding2 from '../../../assets/bg-landing-2.png';

function HeroLanding() {
    return(
        <section className="hero-landing">
            <div className="hero-content">
                <div className="label-landing">
                    <i className="fa-solid fa-magnifying-glass icon-label"></i>
                    <p>Mulai Jelajahi UMKM di Daerahmu!</p>
                </div>
                <div className="hero-text">
                    <h1 className="hero-title"><span>Temukan Umkm </span>Terbaik <br /> di Sekitarmu</h1>
                    <p className="hero-subtitle">Aplikasi terbaik untuk kebutuhan Anda</p>
                </div>
                <a href="/register" className="hero-button">Jelajahi Sekarang!</a>
            </div>
            
            <img src={BgLanding1} alt="" className='bg-landing1'/>
            <img src={BgLanding2} alt="" className='bg-landing2'/>
        </section>
    )
}

export default HeroLanding;