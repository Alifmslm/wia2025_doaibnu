import '../../style/SavePage.css';
import { useNavigate } from "react-router-dom";
import HeaderDefault from '../component/macro-components/HeaderDefault';
import TabSave from '../component/macro-components/TabSave';
function SavePage() {

    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };
    return (
        <>  
            <HeaderDefault />
            <nav className="icon-container">
                <i className="fa-solid fa-arrow-left" onClick={handleBack}></i>
            </nav>
            <section className="save-page">
                <div className="header">
                    <h2>💼 UMKM Tersimpan</h2>
                    <p>Daftar UMKM yang sudah kamu simpan untuk dilihat kembali kapan saja.</p>
                </div>
                <TabSave />
            </section>
        </>
    )
}

export default SavePage