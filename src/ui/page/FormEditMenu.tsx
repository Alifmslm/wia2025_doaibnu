import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderDefault from '../component/macro-components/HeaderDefault';
import '../../style/FormAddUmkm.css';

interface MenuItem {
    id: number; // Untuk key di React
    namaProduk: string;
    deskripsiProduk: string;
    harga: number;
    stok: number;
    fotoProduk: File | null;
}

function FormEditMenu() {
    const navigate = useNavigate();

    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

    const [currentMenuItem, setCurrentMenuItem] = useState<Omit<MenuItem, 'id'>>({
        namaProduk: '',
        deskripsiProduk: '',
        harga: 0,
        stok: 0,
        fotoProduk: null,
    });

    // --- Handlers untuk Menu ---

    /**
     * Menangani perubahan pada form "Tambah Menu"
     */
    const handleMenuChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        let processedValue: string | number = value;
        if (type === 'number') {
            processedValue = value === '' ? 0 : parseFloat(value);
            if (isNaN(processedValue)) {
                processedValue = 0;
            }
        }

        setCurrentMenuItem(prev => ({
            ...prev,
            [name]: processedValue,
        }));
    };

    /**
     * Menangani perubahan file pada form "Tambah Menu"
     */
    const handleMenuFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setCurrentMenuItem(prev => ({
                ...prev,
                fotoProduk: e.target.files![0],
            }));
        }
    };

    /**
     * Menambahkan menu saat ini ke dalam daftar 'menuItems'
     */
    const handleAddMenuItem = () => {
        // Validasi untuk form menu
        if (!currentMenuItem.namaProduk || currentMenuItem.namaProduk.trim() === "") {
            alert("Nama produk wajib diisi.");
            return;
        }
        if (isNaN(currentMenuItem.harga) || currentMenuItem.harga <= 0) {
            alert("Harga produk wajib diisi dan harus lebih besar dari 0.");
            return;
        }
        if (isNaN(currentMenuItem.stok) || currentMenuItem.stok < 0) {
            alert("Stok wajib diisi dan tidak boleh negatif (minimal 0).");
            return;
        }

        const newMenuItem: MenuItem = {
            ...currentMenuItem,
            id: Date.now()
        };

        setMenuItems(prev => [...prev, newMenuItem]);

        // Reset form "Tambah Menu"
        setCurrentMenuItem({
            namaProduk: '',
            deskripsiProduk: '',
            harga: 0,
            stok: 0,
            fotoProduk: null,
        });

        const fileInput = document.getElementById('fotoProduk') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    };

    /**
     * Tombol submit akhir (hanya submit menu)
     */
    const handleFinalSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (menuItems.length === 0) {
            alert("Anda wajib menambahkan minimal satu menu.");
            return;
        }

        // Hanya data menu yang dikirim
        const finalData = {
            menu: menuItems,
        };

        console.log("=== DATA MENU FINAL SIAP DIKIRIM ===");
        console.log(JSON.stringify(finalData, null, 2));

        console.log("File Menu:", menuItems.map(m => m.fotoProduk?.name));

        alert("Update Menu Berhasil!");
        navigate('/profile');
    };

    /**
     * Render Form (Hanya logika dari Step 2)
     */
    const renderMenuForm = () => (
        <>
            {/* 2A: Form untuk menambah menu baru */}
            <form className="menu-add-form" onSubmit={(e) => e.preventDefault()}>
                <h3>Tambah Item Menu Baru</h3>
                <div className="form-group">
                    <label htmlFor="fotoProduk">Foto Produk (Opsional)</label>
                    <input
                        type="file"
                        id="fotoProduk"
                        name="fotoProduk"
                        onChange={handleMenuFileChange}
                        accept="image/*"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="namaProduk">Nama Produk</label>
                    <input
                        type="text"
                        id="namaProduk"
                        name="namaProduk"
                        value={currentMenuItem.namaProduk}
                        onChange={handleMenuChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="deskripsiProduk">Deskripsi Produk (Opsional)</label>
                    <textarea
                        id="deskripsiProduk"
                        name="deskripsiProduk"
                        value={currentMenuItem.deskripsiProduk}
                        onChange={handleMenuChange}
                        rows={3}
                    />
                </div>
                <div className="form-group-row">
                    <div className="form-group">
                        <label htmlFor="harga">Harga (Rp)</label>
                        <input
                            type="number"
                            id="harga"
                            name="harga"
                            value={currentMenuItem.harga === 0 ? '' : currentMenuItem.harga}
                            onChange={handleMenuChange}
                            min="1"
                            placeholder="Contoh: 15000"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="stok">Stok</label>
                        <input
                            type="number"
                            id="stok"
                            name="stok"
                            value={currentMenuItem.stok === 0 ? '' : currentMenuItem.stok}
                            onChange={handleMenuChange}
                            min="0"
                            placeholder="Contoh: 10"
                            required
                        />
                    </div>
                </div>
                <button type="button" onClick={handleAddMenuItem} className="button-secondary-add">
                    + Tambah Item Menu Ini
                </button>
            </form>

            {/* 2B: Daftar menu yang sudah ditambahkan */}
            <div className="menu-list-preview">
                <h3>Daftar Menu ({menuItems.length})</h3>
                {menuItems.length === 0 ? (
                    <p className="empty-message">Anda belum menambahkan menu apapun.</p>
                ) : (
                    menuItems.map((item) => (
                        <div key={item.id} className="menu-item-preview">
                            <p><strong>{item.namaProduk}</strong> - Rp {item.harga.toLocaleString('id-ID')}</p>
                            <p>Stok: {item.stok}</p>
                        </div>
                    ))
                )}
            </div>

            {/* 2C: Form submit akhir */}
            <form onSubmit={handleFinalSubmit}>
                <div className="form-navigation">
                    {/* Tombol "Kembali" dihapus karena tidak ada Step 1 */}

                    {/* Style "space-between" akan otomatis mendorong ini ke kanan */}
                    <button type="submit" className="button-primary-add">
                        Selesai & Simpan Menu
                    </button>
                </div>
            </form>
        </>
    );

    return (
        <>
            <HeaderDefault />
            <section className="add-umkm-page">
                <div className="form-container">

                    <button onClick={() => navigate(-1)} className="back-button-page">
                        <i className="fa-solid fa-chevron-left"></i> Kembali ke Profil
                    </button>

                    <div className="form-header">
                        <h2>Edit / Tambah Menu</h2>
                        {/* Indikator step dihapus karena tidak relevan lagi */}
                    </div>

                    {renderMenuForm()}

                </div>
            </section>
        </>
    );
}

export default FormEditMenu;