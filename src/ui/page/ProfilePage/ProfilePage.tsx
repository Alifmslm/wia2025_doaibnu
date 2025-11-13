import TabProfile from "./TabProfile"
import HeaderDefault from '../../component/macro-components/HeaderDefault';
import '../../../style/ProfilePage.css';

function ProfilePage() {
    const getInitials = (name: string): string => name?.split(' ').filter(Boolean).map(word => word[0].toUpperCase()).join('') || '';
    return(
        <>
            <HeaderDefault />
            <section className="profile-page">
                <div className="profile-info-header">
                    <div className="profile-picture">
                        <p>{getInitials("Alif")}</p>
                    </div>
                    <h2>Alif Muslim Abdurrahman</h2>
                    <p>alifmslm01@gmail.com</p>
                    <button>Daftarkan Umkm Anda!</button>
                </div>
                <TabProfile />
            </section>
        </>
    )
}

export default ProfilePage