import "../../../style/UmkmList.css";
import UmkmCard from "../micro-components/UmkmCard";

function UmkmList() {
    return(
        <>
            <section className="card-grid-container">
                <section className="card-grid">
                    <UmkmCard/>
                    <UmkmCard/>
                    <UmkmCard/>
                </section>
            </section>
        </>
    )
}

export default UmkmList;