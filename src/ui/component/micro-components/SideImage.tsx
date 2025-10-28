import LogoWia from "../../../assets/logo_wia.jpg";

function SideImage() {
    return (
        <>
            <section className="side_image">
                <div className="overlay">
                    <img src={LogoWia} alt="" className="img_logo" />
                    <div className="side_content">
                        <p className="quote">
                            “Baru tahu, banyak banget UMKM unik dan kreatif di sini.!”
                        </p>
                        <div className="user_info">
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