// src/page/MenuPage/MenuPage.tsx
import './MenuPage.css'
import Product from './Product'
// 1. Impor Tipe BARU
import type { MenuItemFromDB } from '../../../shared/types/Umkm';

// 2. Tentukan props
interface MenuPageProps {
    menuItems: MenuItemFromDB[];
}

function MenuPage({ menuItems }: MenuPageProps) {
    
    // 3. Cek jika tidak ada menu
    if (!menuItems || menuItems.length === 0) {
        return (
             <section className="menu-page">
                <div className="menu-page-header">
                    <h3>Menu UMKM Kami</h3>
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
                    {/* TODO: Sembunyikan link ini jika bukan pemilik */}
                    <a href="/edit-menu">Edit Menu Anda?</a>
                </div>
                <div className="product-list">
                    {/* 4. Map data dinamis ke komponen Product */}
                    {menuItems.map((item) => (
                        <Product key={item.id} item={item} />
                    ))}
                </div>
            </section>
        </>
    )
}

export default MenuPage;