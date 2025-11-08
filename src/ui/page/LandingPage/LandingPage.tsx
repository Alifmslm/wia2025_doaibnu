import NavLanding from "./NavLanding";
import '../../../style/LandingPage.css';
import HeroLanding from "./HeroLanding";
// import HeroDecoration from "./HeroDecoration";
// import FooterLanding from "./FooterLanding";
import UmkmFavorit from "./UmkmFavorit";

function LandingPage() {
    return(
        <>
            <NavLanding />  
            <HeroLanding />
            {/* <HeroDecoration /> */}
            <UmkmFavorit />
            {/* <FooterLanding />    */}
        </>
    )
}

export default LandingPage;