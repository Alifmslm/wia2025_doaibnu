import LogoWia from "../../../assets/logo_ngulikumkm.png";

function SideImage() {
    return (
        <>
            <section className="side_image-login">
                <div className="overlay-login">
                    <img src={LogoWia} alt="" className="img_logo" />
                    <div className="side_content-login">
                        <p className="quote-login">
                            “Baru tahu, banyak banget UMKM unik dan kreatif di sini.!”
                        </p>
                        <div className="user_info-login">
                            <p className="name">Maulana Aditya</p>
                            <p className="role">Pengguna Setia, Sejak 2024</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default SideImage