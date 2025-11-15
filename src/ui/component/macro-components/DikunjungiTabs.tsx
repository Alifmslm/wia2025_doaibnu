import type { UmkmFromDB } from "../../../shared/types/Umkm";
import UmkmCard from "../micro-components/UmkmCard";

// 1. Tentukan tipe props
interface DikunjungiTabsProps {
    visitedUmkms: UmkmFromDB[];
}

function DikunjungiTabs({ visitedUmkms }: DikunjungiTabsProps) {

    if (visitedUmkms.length === 0) return <p>Belum ada UMKM yang ditandai telah dikunjungi.</p>;

    return (
        <section className="umkm-dikunjungi-list">
            <div className="card-grid-dikunjngi"> 
                {visitedUmkms.map((umkm) => (
                    <UmkmCard key={umkm.id} umkm={umkm} />
                ))}
            </div>
        </section>
    );
}

export default DikunjungiTabs;