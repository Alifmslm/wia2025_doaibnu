import './MenuPage.css'
import Product from './Product'
import type { MenuItemFromDB } from '../../../shared/types/Umkm';
import { Link } from 'react-router-dom'; // <-- 1. Impor Link

// 2. Definisikan props baru
interface MenuPageProps {
    menuItems: MenuItemFromDB[];
    isOwner: boolean; // <-- Terima
    umkmId: number;   // <-- Terima
}

function MenuPage({ menuItems, isOwner, umkmId }: MenuPageProps) { // <-- Terima di sini
    
    if (!menuItems || menuItems.length === 0) {
        return (
             <section className="menu-page">
                <div className="menu-page-header">
                    <h3>Menu UMKM Kami</h3>
                    {/* 3. Tampilkan link HANYA jika owner */}
                    {isOwner && (
                        <Link to={`/edit-menu/${umkmId}`}>Edit Menu Anda?</Link>
                    )}
                </div>
                <p className="no-data-text" style={{ padding: '1rem 0' }}>
                    Belum ada menu yang didaftarkan.
                </p>
            </section>
        )
    }

    return (
        <>
            <section className="menu-page">
                <div className="menu-page-header">
                    <h3>Menu UMKM Kami</h3>
                    {/* 4. Tampilkan link HANYA jika owner */}
                    {isOwner && (
                        <Link to={`/edit-menu/${umkmId}`}>Edit Menu Anda?</Link>
                    )}
                </div>
                <div className="product-list">
                    {menuItems.map((item) => (
                        <Product key={item.id} item={item} />
                    ))}
                </div>
            </section>
        </>
    )
}

export default MenuPage;