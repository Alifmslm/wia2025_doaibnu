import HeaderDefault from "../component/macro-components/HeaderDefault"
import HeroDetail from "../component/macro-components/HeroDetail"

import img1 from "../../assets/card-image.png";
import img2 from "../../assets/card-image.png";
import img3 from "../../assets/card-image.png";

function DetailPage() {
    const images = [img1, img2, img3]
    return(
        <>
            <HeaderDefault/>
            <HeroDetail images={images}/>
            <section className="detail-content">
                
            </section>
        </>
    )
}

export default DetailPage