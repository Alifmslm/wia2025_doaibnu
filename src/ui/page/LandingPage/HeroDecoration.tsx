import StarDecor from "../../../assets/star_decoration.png";

const BannerContent = () => (
    <>
        <p>DUKUNG UMKM DISEKITARMU</p>
        <img alt="decor-icon" className="separator-icon" src={StarDecor} />
    </>
);

const BannerTrackItems = () => (
    <>
        <BannerContent />
        <BannerContent />
        <BannerContent />
        <BannerContent />
        <BannerContent />
        <BannerContent />
        <BannerContent />
        <BannerContent />
        <BannerContent />
    </>
);

function HeroDecoration() {
    return (
        <div className="hero-decoration-wrapper">
            <div className="banner banner-green">
                <div className="banner-track">
                    <BannerTrackItems /> {/* Set 1 */}
                    <BannerTrackItems /> {/* Set 2 (Duplikat untuk looping) */}
                </div>
            </div>
            <div className="banner banner-orange">
                {/* Menambahkan class 'track-reverse' untuk animasi berlawanan arah */}
                <div className="banner-track track-reverse">
                    <BannerTrackItems /> {/* Set 1 */}
                    <BannerTrackItems /> {/* Set 2 (Duplikat untuk looping) */}
                </div>
            </div>
        </div>
    )
}

export default HeroDecoration;