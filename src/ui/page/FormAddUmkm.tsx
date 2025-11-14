import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderDefault from '../component/macro-components/HeaderDefault';
// Pastikan Anda mengimpor file CSS yang akan kita buat
import '../../style/FormAddUmkm.css'; 

// Tipe data untuk informasi UMKM (Step 1)
interface UmkmFormData {
    nama: string;
    kategori: 'Indonesia' | 'Asia' | 'Western' | 'Lain-lain' | '';
    deskripsi: string;
    lokasiGeneral: string;
    linkGmaps: string;
    gallery: File[]; // Menyimpan daftar file untuk upload
}

// Tipe data untuk satu item menu (Step 2)
interface MenuItem {
    id: number; // Untuk key di React
    namaProduk: string;
    deskripsiProduk: string;
    harga: number;
    stok: number;
    fotoProduk: File | null; // Menyimpan satu file
}

function FormAddUmkm() {
    const navigate = useNavigate();

    // State untuk mengontrol step (1 = Info UMKM, 2 = Info Menu)
    const [step, setStep] = useState(1);

    // === State untuk Step 1: Info UMKM ===
    const [umkmData, setUmkmData] = useState<UmkmFormData>({
        nama: '',
        kategori: '',
        deskripsi: '',
        lokasiGeneral: '',
        linkGmaps: '',
        gallery: [],
    });

    // === State untuk Step 2: Info Menu ===
    // Menyimpan daftar menu yang sudah ditambahkan
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    
    // Menyimpan data untuk form "Tambah Menu" saat ini
    const [currentMenuItem, setCurrentMenuItem] = useState<Omit<MenuItem, 'id'>>({
        namaProduk: '',
        deskripsiProduk: '',
        harga: 0,
        stok: 0,
        fotoProduk: null,
    });

    // --- Handlers untuk Step 1 ---

    /**
     * Menangani perubahan pada input teks, textarea, dan select
     */
    const handleUmkmChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUmkmData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUmkmFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            // Ubah FileList menjadi array dan simpan di state
            setUmkmData(prev => ({
                ...prev,
                gallery: Array.from(e.target.files!),
            }));
        }
    };

    /**
     * Pindah dari Step 1 ke Step 2 (DENGAN VALIDASI KETAT)
     */
    const handleNextStep = (e: FormEvent) => {
        e.preventDefault();
        
        // Validasi ketat untuk semua field
        if (umkmData.nama.trim() === '') {
            alert("Nama UMKM wajib diisi.");
            return;
        }
        if (umkmData.kategori === '') {
            alert("Jenis Makanan wajib dipilih.");
            return;
        }
        if (umkmData.gallery.length === 0) {
            alert("Anda wajib mengunggah minimal satu foto UMKM.");
            return;
        }
        if (umkmData.deskripsi.trim() === '') {
            alert("Deskripsi wajib diisi.");
            return;
        }
        if (umkmData.lokasiGeneral.trim() === '') {
            alert("Lokasi General wajib diisi.");
            return;
        }
        if (umkmData.linkGmaps.trim() === '') {
            alert("Link Google Maps wajib diisi.");
            return;
        }

        // Jika semua lolos validasi
        console.log("Data UMKM (Step 1) Lolos Validasi:", umkmData);
        setStep(2);
    };

    // --- Handlers untuk Step 2 ---

    /**
     * Menangani perubahan pada form "Tambah Menu"
     */
    const handleMenuChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        
        // Cek jika input number kosong, set sebagai 0 (atau nilai default)
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
    // ==========================================================
    // **PERUBAHAN DI SINI:** Validasi menu yang lebih ketat
    // ==========================================================
    const handleAddMenuItem = () => {
        // Validasi untuk form menu
        if (!currentMenuItem.namaProduk || currentMenuItem.namaProduk.trim() === "") {
            alert("Nama produk wajib diisi.");
            return;
        }
        // Cek harga (termasuk jika user mengetik huruf, akan jadi NaN)
         if (isNaN(currentMenuItem.harga) || currentMenuItem.harga <= 0) {
            alert("Harga produk wajib diisi dan harus lebih besar dari 0.");
            return;
        }
        // Cek stok (termasuk jika user mengetik huruf, akan jadi NaN)
        if (isNaN(currentMenuItem.stok) || currentMenuItem.stok < 0) {
            alert("Stok wajib diisi dan tidak boleh negatif (minimal 0).");
            return;
        }
        // Foto dan Deskripsi produk opsional, jadi tidak divalidasi

        const newMenuItem: MenuItem = {
            ...currentMenuItem,
            id: Date.now() // Pakai timestamp sebagai ID unik sementara
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
        
        // Kosongkan input file (trik)
        const fileInput = document.getElementById('fotoProduk') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    };
    // ==========================================================
    // **AKHIR PERUBAHAN**
    // ==========================================================

    /**
     * Tombol submit akhir
     */
    const handleFinalSubmit = (e: FormEvent) => {
        e.preventDefault();

        // Pastikan ada minimal 1 menu (sesuai permintaan "wajib")
        if (menuItems.length === 0) {
            alert("Anda wajib menambahkan minimal satu menu.");
            return;
        }

        // Gabungkan semua data untuk dikirim (simulasi integrasi JSON)
        const finalData = {
            infoUmkm: umkmData,
            menu: menuItems,
        };

        console.log("=== DATA UMKM FINAL SIAP DIKIRIM ===");
        console.log(JSON.stringify(finalData, null, 2));
        
        // Tampilkan nama file (karena File object tidak bisa di-JSON.stringify)
        console.log("File Galeri UMKM:", umkmData.gallery.map(f => f.name));
        console.log("File Menu:", menuItems.map(m => m.fotoProduk?.name));

        alert("Pendaftaran UMKM Berhasil!");
        // Arahkan kembali ke halaman profil atau list UMKM
        navigate('/profile'); 
    };

    // --- Render ---

    /**
     * Render Form untuk Step 1
     */
    const renderStepOne = () => (
        // Menghapus noValidate agar `required` HTML berfungsi
        <form onSubmit={handleNextStep} className="umkm-form">
            
            <div className="form-group">
                <label htmlFor="nama">Nama UMKM</label>
                <input
                    type="text"
                    id="nama"
                    name="nama"
                    value={umkmData.nama}
                    onChange={handleUmkmChange}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="kategori">Jenis Makanan</label>
                <select
                    id="kategori"
                    name="kategori"
                    value={umkmData.kategori}
                    onChange={handleUmkmChange}
                    required
                >
                    <option value="" disabled>Pilih Kategori</option>
                    <option value="Indonesia">Indonesia</option>
                    <option value="Asia">Asia</option>
                    <option value="Western">Western</option>
                    <option value="Lain-lain">Lain-lain</option>
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="gallery">Foto UMKM (Bisa lebih dari satu)</label>
                <input
                    type="file"
                    id="gallery"
                    name="gallery"
                    onChange={handleUmkmFileChange}
                    multiple // Penting untuk multi-file
                    accept="image/*"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="deskripsi">Deskripsi</label>
                <textarea
                    id="deskripsi"
                    name="deskripsi"
                    value={umkmData.deskripsi}
                    onChange={handleUmkmChange}
                    rows={4}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="lokasiGeneral">Lokasi General (Contoh: Jakarta Selatan)</label>
                <input
                    type="text"
                    id="lokasiGeneral"
                    name="lokasiGeneral"
                    value={umkmData.lokasiGeneral}
                    onChange={handleUmkmChange}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="linkGmaps">Link Google Maps</label>
                <input
                    type="url"
                    id="linkGmaps"
                    name="linkGmaps"
                    value={umkmData.linkGmaps}
                    onChange={handleUmkmChange}
                    placeholder="https://maps.app.goo.gl/..."
                    required
                />
            </div>

            <div className="form-navigation">
                <button type="submit" className="button-primary-add">Lanjut ke Tambah Menu</button>
            </div>
        </form>
    );

    /**
     * Render Form untuk Step 2
     */
    const renderStepTwo = () => (
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
                        required // Validasi HTML
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
                            // Kontrol value agar 0 tidak muncul saat input kosong
                            value={currentMenuItem.harga === 0 ? '' : currentMenuItem.harga}
                            onChange={handleMenuChange}
                            min="1" // Harga minimal 1
                            placeholder="Contoh: 15000"
                            required // Validasi HTML
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="stok">Stok</label>
                        <input
                            type="number"
                            id="stok"
                            name="stok"
                            // Kontrol value agar 0 tidak muncul saat input kosong
                            value={currentMenuItem.stok === 0 ? '' : currentMenuItem.stok}
                            onChange={handleMenuChange}
                            min="0"
                            placeholder="Contoh: 10"
                            required // Validasi HTML
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
                    <button type="button" onClick={() => setStep(1)} className="button-secondary-add">
                        <i className="fa-solid fa-arrow-left"></i> Kembali ke Info UMKM
                    </button>
                    <button type="submit" className="button-primary-add">
                        Selesai & Daftarkan UMKM
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
                        <h2>{step === 1 ? 'Langkah 1: Informasi UMKM' : 'Langkah 2: Informasi Menu'}</h2>
                        <div className="step-indicator">
                            <span className={step === 1 ? 'active' : 'completed'}>1</span>
                            <div className={`step-line ${step === 2 ? 'active' : ''}`}></div>
                            <span className={step === 2 ? 'active' : ''}>2</span>
                        </div>
                    </div>

                    {step === 1 ? renderStepOne() : renderStepTwo()}

                </div>
            </section>
        </>
    );
}

export default FormAddUmkm;