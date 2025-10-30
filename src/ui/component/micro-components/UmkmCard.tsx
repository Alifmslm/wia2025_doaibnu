import RatingLabel from "../micro-components/RatingLabel.tsx";
import SaveButton from "../../../assets/save-button-colored.png";

function UmkmCard() {
    return (
        <>
            <a href="/detail-page" className="card-link">
                <section className="card">
                    <div className="card-image">
                        <div className="card-meta">
                            <div className="category-label">
                                <p>Makanan</p>
                            </div>
                            <div className="save-button">
                                <img src={SaveButton} alt="saved-button" />
                            </div>
                        </div>
                    </div>
                    <div className="card-content">
                        <RatingLabel />
                        <div className="card-text">
                            <h1>Soto Ayam Bu Carti</h1>
                            <p>Malang, Jawa Timur</p>
                        </div>
                    </div>
                </section>
            </a>
        </>
    );
}

export default UmkmCard