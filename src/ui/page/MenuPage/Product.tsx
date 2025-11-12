import GambarProduk from '../../../assets/gallery-image-2.png'

function Product() {
    return (

        <>
            <div className="product">
                <div className="products-card">
                    <div className="product-content">
                        <div className="product-content-text">
                            <h3 className="product-title">Nasi Ayam Bakar Sambal Matah</h3>

                            <p className="product-description">
                                Nikmati cita rasa autentik Nusantara melalui perpaduan ayam bakar yang dibumbui rempah khas,
                                disajikan bersama nasi hangat, lalapan segar, dan sambal matah buatan sendiri yang pedasnya
                                pas di lidah. Semua bahan diolah setiap hari agar tetap segar dan gurih, tanpa pengawet tambahan.
                                Cocok dinikmati saat makan siang maupun makan malam bersama keluarga.
                                Kami juga menyediakan opsi level pedas dan paket hemat untuk pemesanan dalam jumlah besar.
                            </p>
                        </div>

                        <div className="product-footer">
                            <span className="product-price">Rp 125.000</span>
                        </div>
                    </div>

                    <img src={GambarProduk} alt="products-image" className="products-image" />
                </div>
                <hr className='hr-product' />
            </div>
        </>
    )
}

export default Product