import NavLanding from "./NavLanding";
import '../../../style/LandingPage.css';
import HeroLanding from "./HeroLanding";
// import HeroDecoration from "./HeroDecoration";
import FooterLanding from "./FooterLanding";

function LandingPage() {
    return(
        <>
            <NavLanding />
            <HeroLanding />
            {/* <HeroDecoration /> */}
            <FooterLanding />   
        </>
    )
}

export default LandingPage;