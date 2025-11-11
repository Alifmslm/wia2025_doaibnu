function Product() {
    return(
        <div className="product-card">
            <div className="product-image-container">
                <img src="" alt="" />
            </div>
            
            <div className="product-content-menu">
                <h3 className="product-title">Nama Produk yang Panjang Sekali dan Menarik</h3>
            
                <p className="product-description">
                    Ini adalah deskripsi produk yang cukup panjang untuk menguji fitur pemotongan 
                    (concatenation). Deskripsi ini harus terpotong otomatis setelah mencapai baris 
                    ketiga agar tata letak kartu tetap rapi dan konsisten.
                </p>
                
                <div className="product-footer">
                    <span className="product-price">Rp 125.000</span>
                </div>
            </div>
        </div>
    )
}

export default Product