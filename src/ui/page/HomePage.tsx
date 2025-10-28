import "../../style/HomePage.css";
import HeaderDefault from "../component/macro-components/HeaderDefault.tsx";
import HeroImage from "../component/macro-components/HeroImage.tsx";
import SearchFilterContainer from "../component/macro-components/SearchFilterContainer.tsx";
import UmkmList from "../component/macro-components/UmkmList.tsx";

function HomePage() {
    return(
        <>
            <HeaderDefault/>
            <HeroImage/>
            <SearchFilterContainer/>
            <UmkmList/>
        </>
    )
}

export default HomePage;