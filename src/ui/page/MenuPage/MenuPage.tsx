import './MenuPage.css'
import Product from './Product'

function MenuPage() {
    return (
        <>
            <section className="menu-page">
                <div className="menu-page-header">
                    <h3>Makanan Terfavorit Kami</h3>
                    <a href="">Edit Menu Anda?</a>
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