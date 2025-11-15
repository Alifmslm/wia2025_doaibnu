import { useState, useRef, type ChangeEvent, type FormEvent } from 'react';
import type { MenuItem } from '../../shared/types/Umkm'; // Sesuaikan path jika perlu

// Tipe data untuk form 'Tambah Menu'
type NewMenuItemData = Omit<MenuItem, 'id'>;

// Props yang diterima dari Induk
interface FormMenuAddProps {
    initialData: MenuItem[];
    onSubmit: (data: MenuItem[]) => void;
    onBack: () => void;
}

// Nilai default untuk reset form menu
const defaultCurrentMenu: NewMenuItemData = {
    namaProduk: '',
    deskripsiProduk: '',
    harga: 0,
    stok: 0,
    fotoProduk: null,
};

function FormMenuAdd({ initialData, onSubmit, onBack }: FormMenuAddProps) {
    // State untuk daftar menu yang sudah ditambahkan
    const [menuItems, setMenuItems] = useState<MenuItem[]>(initialData);
    
    // State untuk form "Tambah Menu" (dikelola lokal di sini)
    const [currentMenuItem, setCurrentMenuItem] = useState<NewMenuItemData>(defaultCurrentMenu);

    // Ref untuk mereset input file (Cara React)
    const fileInputRef = useRef<HTMLInputElement>(null);

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
            id: Date.now() // Pakai timestamp sebagai ID unik sementara
        };

        setMenuItems(prev => [...prev, newMenuItem]);

        // Reset form "Tambah Menu"
        setCurrentMenuItem(defaultCurrentMenu);
        
        // Kosongkan input file (menggunakan ref)
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    /**
     * Menjalankan validasi akhir dan mengirim data ke induk
     */
    const handleFinalSubmit = (e: FormEvent) => {
        e.preventDefault();

        // Pastikan ada minimal 1 menu
        if (menuItems.length === 0) {
            alert("Anda wajib menambahkan minimal satu menu.");
            return;
        }

        // Kirim data (array menuItems) ke induk
        onSubmit(menuItems);
    };

    return (
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
                        ref={fileInputRef} // Tambahkan ref di sini
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
                            {/* Di sini Anda bisa menambahkan tombol "Hapus" jika perlu */}
                        </div>
                    ))
                )}
            </div>

            {/* 2C: Form submit akhir dan navigasi */}
            <form onSubmit={handleFinalSubmit}>
                <div className="form-navigation">
                    <button type="button" onClick={onBack} className="button-secondary-add">
                        <i className="fa-solid fa-arrow-left"></i> Kembali ke Info UMKM
                    </button>
                    <button type="submit" className="button-primary-add">
                        Selesai & Daftarkan UMKM
                    </button>
                </div>
            </form>
        </>
    );
}

export default FormMenuAdd;