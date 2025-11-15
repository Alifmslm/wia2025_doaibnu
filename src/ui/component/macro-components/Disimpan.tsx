import type { UmkmFromDB } from "../../../shared/types/Umkm"; 
import UmkmCard from "../micro-components/UmkmCard";
import Checkbox from "@mui/material/Checkbox";

// 1. Tentukan tipe props yang diterima dari TabSave
interface DisimpanProps {
    savedUmkms: UmkmFromDB[];
    onMoveToVisited: (umkm: UmkmFromDB) => void; // Fungsi handler
}

function Disimpan({ savedUmkms, onMoveToVisited }: DisimpanProps) {

    // 2. Tidak ada lagi state loading, error, atau useEffect di sini

    const handleCheckboxChange = (umkm: UmkmFromDB) => {
        if (!window.confirm("Pindahkan UMKM ini ke daftar 'Telah Dikunjungi'?")) {
            return;
        }
        // 3. Panggil fungsi yang diberikan oleh induk
        onMoveToVisited(umkm);
    };

    if (savedUmkms.length === 0) return <p>Anda belum menyimpan UMKM apapun.</p>;

    return (
        <section className="umkm-tersimpan-list">
            <div className="card-grid-simpan">
                {savedUmkms.map((umkm) => (
                    <div 
                        key={umkm.id} 
                        className="simpan-item-row"
                    >
                        
                        <Checkbox 
                            // 4. Kirim seluruh objek 'umkm' ke handler
                            onChange={() => handleCheckboxChange(umkm)}
                            inputProps={{ 'aria-label': `Tandai ${umkm.nama} sebagai dikunjungi` }}
                            title="Tandai sudah dikunjungi"
                        />

                        <div style={{ flex: 1 }}>
                            <UmkmCard umkm={umkm} />
                        </div>

                    </div>
                ))}
            </div>
        </section>
    );
}

export default Disimpan;