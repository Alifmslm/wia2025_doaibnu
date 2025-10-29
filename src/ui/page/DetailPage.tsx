import HeaderDefault from "../component/macro-components/HeaderDefault"
import HeroDetail from "../component/macro-components/HeroDetail"
import PlaceMediaContent from "../component/macro-components/PlaceMediaContent";
import SaveIcon from "../../assets/save-button-grey.png"
import "../../style/DetailPage.css"

import img1 from "../../assets/card-image.png";
import img2 from "../../assets/card-image.png";
import img3 from "../../assets/card-image.png";

function DetailPage() {
    const images = [img1, img2, img3]
    return (
        <>
            <HeaderDefault />
            <HeroDetail images={images} />
            <div className="detail-content-container">
                <section className="detail-content">
                    <section className="label-content">
                        <div className="label-detail__on">
                            Makanan
                        </div>
                        <button className="button-save-detail">
                            <img src={SaveIcon} alt="tombol simpan" />
                            Simpan Umkm
                        </button>
                    </section>
                    <div className="text-container-detail">
                        <h1>Ayam Geprek Pak Sholeh</h1>
                        <p>Malang, East Java</p>
                    </div>
                    <p className="description-detail">
                        Lorem ipsum dolor sit amet consectetur. Nunc nunc phasellus elit sed non. Consequat non curabitur tempus faucibus id dui metus lectus vestibulum. In vestibulum et pharetra dui varius scelerisque. Vestibulum orci leo duis arcu. Justo faucibus ut pellentesque ornare cursus egestas enim pellentesque non. Augue consequat fermentum bibendum mauris. Sed purus massa dui pulvinar risus ornare arcu justo. Vel amet neque in lacus sed leo molestie sit metus. Viverra enim aliquet duis interdum magna. Fringilla scelerisque volutpat lacus morbi ut eget dui tincidunt. Et ultricies neque orci donec et dignissim sollicitudin nisi. Porta nunc eleifend diam enim scelerisque. In integer magna dolor ut feugiat sit neque vitae. Posuere diam ut non mauris lorem ultrices risus pellentesque.
                    </p>
                    <p className="see-all-desc">
                        Lihat Selengkapnya
                    </p>
                    <PlaceMediaContent />
                </section>
            </div>
        </>
    )
}

export default DetailPage