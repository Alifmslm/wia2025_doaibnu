// src/page/MenuPage/Product.tsx
import GambarProduk from '../../../assets/gallery-image-2.png' // Fallback
// 1. Impor Tipe BARU
import type { MenuItemFromDB } from '../../../shared/types/Umkm';

// 2. Tentukan props
interface ProductProps {
    item: MenuItemFromDB;
}

function Product({ item }: ProductProps) {
    // 3. Gunakan data dinamis dari props
    const imageUrl = item.foto_produk || GambarProduk; // Gunakan gambar asli, atau fallback
    const price = `Rp ${item.harga.toLocaleString('id-ID')}`;
    const stock = `${item.stok} Stok Tersedia`;

    return (
        <>
            <div className="product">
                <div className="products-card">
                    <div className="product-content">
                        <div className="product-content-text">
                            <h3 className="product-title">{item.nama_produk}</h3>

                            <p className="product-description">
                                {item.deskripsi_produk || "Tidak ada deskripsi."}
                            </p>
                        </div>

                        <div className="product-footer">
                            <span className="product-price">{price}</span>
                            <span className='product-stock'>{stock}</span>
                        </div>
                    </div>

                    <img src={imageUrl} alt={item.nama_produk} className="products-image" />
                </div>
                <hr className='hr-product' />
            </div>
        </>
    )
}

export default Product;