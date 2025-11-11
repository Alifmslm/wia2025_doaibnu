import './MenuPage.css'
import Product from './Product'

function MenuPage() {
    return (
        <>
            <section className="menu-page">
                <h2>Makanan Terfavorit</h2>
                <hr className="hr-menu" />
                <div className="product-list">
                    <Product />
                </div>
            </section>
        </>
    )
}

export default MenuPage