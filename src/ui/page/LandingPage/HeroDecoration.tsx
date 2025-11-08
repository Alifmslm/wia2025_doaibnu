import StarDecor from "../../../assets/star_decoration.png";

const BannerContent = () => (
    <>
        <p>DUKUNG UMKM DISEKITARMU</p>
        <img alt="decor-icon" className="separator-icon" src={StarDecor} />
    </>
);

function HeroDecoration() {
    return (
        <div className="hero-decoration-wrapper">
            <div className="banner banner-green">
                <BannerContent />
                <BannerContent />
                <BannerContent />
                <BannerContent />
                <BannerContent />
                <BannerContent />
                <BannerContent />
                <BannerContent />
                <BannerContent />
            </div>
            <div className="banner banner-orange">
                <BannerContent />
                <BannerContent />
                <BannerContent />
                <BannerContent />
                <BannerContent />
                <BannerContent />
                <BannerContent />
                <BannerContent />
                <BannerContent />
            </div>
        </div>
    )
}

export default HeroDecoration;