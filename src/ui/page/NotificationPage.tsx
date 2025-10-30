import '../../style/NotificationPage.css';
import { useNavigate } from "react-router-dom";
import CloseButton from '../../assets/close-button.png'
import HeaderDefault from '../component/macro-components/HeaderDefault';

function NotificationPage() {

    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1); // ini akan kembali ke halaman sebelumnya
    };
    return (
        <>  
            <HeaderDefault />
            <nav className="icon-container">
                <div className="icon-item">
                    <img src={CloseButton} alt="close-button" onClick={handleBack} />
                </div>
            </nav>
            <section className="notification">
                <div className="header">
                    <h1>Notification</h1>
                    <p className='subheader-notif'>Tempat kamu melihat notifikasi</p>
                </div>

                <div className="notification-list">
                    <div className="content">
                        <div className="header">
                            <h1>✨ Klaim UMKM Anda Sedang Diproses</h1>
                            <p className='notif-time'>1 Minggu yang lalu</p>
                        </div>
                        <p className='desc-notif'>Terima kasih telah mengajukan klaim! Tim kami sedang memeriksa data dan dokumen Anda. Kami akan mengabari Anda segera setelah proses selesai.</p>
                    </div>
                    <div className="content">
                        <div className="header">
                            <h1>✨ Klaim UMKM Anda Sedang Diproses</h1>
                            <p className='notif-time'>1 Minggu yang lalu</p>
                        </div>
                        <p className='desc-notif'>Terima kasih telah mengajukan klaim! Tim kami sedang memeriksa data dan dokumen Anda. Kami akan mengabari Anda segera setelah proses selesai.</p>
                    </div>
                </div>
            </section>
        </>
    )
}

export default NotificationPage