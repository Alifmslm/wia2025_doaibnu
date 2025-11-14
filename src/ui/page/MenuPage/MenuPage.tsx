import './MenuPage.css'
import Product from './Product'

function MenuPage() {
    return (
        <>
            <section className="menu-page">
                <div className="menu-page-header">
                    <h3>Menu UMKM Kami</h3>
                    <a href="/edit-menu">Edit Menu Anda?</a>
                </div>
                <div className="product-list">
                    <Product />
                    <Product />
                </div>
            </section>
        </>
    )
}

export default MenuPage