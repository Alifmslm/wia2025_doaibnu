import './MenuPage.css'
import Product from './Product'

function MenuPage() {
    return (
        <>
            <section className="menu-page">
                <h2>Makanan Terfavorit Kami</h2>
                <div className="product-list">
                    <Product />
                    <Product />
                </div>
            </section>
        </>
    )
}

export default MenuPage