import RatingLabel from "../micro-components/RatingLabel.tsx";
import SaveButton from "../../../assets/save-button-colored.png";
import type { Umkm } from "../../../shared/types/Umkm";
import { UmkmRepository } from "../../../data/repositories/UmkmRepository";
import HomeImage from '../../../assets/gallery-image-1.png' 

function UmkmCard({ umkm }: { umkm: Umkm }) {
    const avgRating = UmkmRepository.getAverageRating(umkm);
    const totalRatings = umkm.ratings?.length || 0;

    return (
        <a href={`/detail-page/${umkm.id}`} className="card-link">
            <section className="card">
                <div
                    className="card-image"
                    style={{
                        backgroundImage: `url(${HomeImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                >
                    <div className="card-meta">
                        <div className="category-label">
                            <p>{umkm.kategori}</p>
                        </div>
                        <div className="save-button">
                            <img src={SaveButton} alt="saved-button" />
                        </div>
                    </div>
                </div>

                <div className="card-content">
                    <RatingLabel rating={avgRating} total={totalRatings} />
                    <div className="card-text">
                        <h1>{umkm.nama}</h1>
                        <p>{umkm.lokasi?.lokasi_general}</p>
                    </div>
                </div>
            </section>
        </a>
    );
}

export default UmkmCard;