import { useState, useEffect, useRef, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderDefault from '../component/macro-components/HeaderDefault';
import '../../style/FormEditMenu.css'; // <-- Menggunakan CSS yang sama

// Impor tipe DAN repository
import type { MenuItem } from '../../shared/types/Umkm'; // Tipe Form
import type { MenuItemFromDB } from '../../shared/types/Umkm'; // Tipe DB
import { UmkmRepository } from '../../data/repositories/UmkmRepository';
import { UserRepository } from '../../data/repositories/UserRepository';

// Tipe untuk form 'Tambah/Edit Menu'
type MenuFormData = Omit<MenuItem, 'id'>;

// Nilai default untuk reset form
const defaultMenuForm: MenuFormData = {
    namaProduk: '',
    deskripsiProduk: '',
    harga: 0,
    stok: 0,
    fotoProduk: null,
};

function FormEditMenu() {
    const navigate = useNavigate();
    const { id: umkmIdParam } = useParams<{ id: string }>(); 
    const umkmId = Number(umkmIdParam);

    // --- State ---
    const [existingMenus, setExistingMenus] = useState<MenuItemFromDB[]>([]);
    const [currentForm, setCurrentForm] = useState<MenuFormData>(defaultMenuForm);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- Efek untuk Fetch Data ---
    useEffect(() => {
        if (!umkmIdParam || isNaN(umkmId)) {
            setError("ID UMKM tidak valid.");
            setIsLoading(false);
            return;
        }

        async function fetchData() {
            setIsLoading(true);
            try {
                const umkmData = await UmkmRepository.getById(umkmId);
                if (!umkmData) {
                    throw new Error("UMKM tidak ditemukan.");
                }
                const user = await UserRepository.getCurrentUser();
                if (!user || user.id !== umkmData.owner_id) {
                    throw new Error("Anda tidak berhak mengakses halaman ini.");
                }
                setExistingMenus(umkmData.menu_items || []);
            } catch (err: any) {
                setError(err.message || "Gagal memuat data.");
                // navigate('/'); // Opsional: lempar jika tidak berhak
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [umkmId, umkmIdParam, navigate]);

    // --- Handlers Form ---
    const handleMenuChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        let processedValue: string | number = value;
        if (type === 'number') {
            processedValue = value === '' ? 0 : parseFloat(value);
            if (isNaN(processedValue)) processedValue = 0;
        }
        setCurrentForm(prev => ({ ...prev, [name]: processedValue }));
    };

    const handleMenuFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setCurrentForm(prev => ({ ...prev, fotoProduk: e.target.files![0] }));
        }
    };
    
    // --- Handlers Aksi CRUD ---
    const refreshMenus = async () => {
         const data = await UmkmRepository.getById(umkmId);
         setExistingMenus(data?.menu_items || []);
    };

    const handleSubmitItem = async (e: FormEvent) => {
        e.preventDefault();
        
        if (currentForm.namaProduk.trim() === "") {
            alert("Nama produk wajib diisi.");
            return;
        }
        if (isNaN(currentForm.harga) || currentForm.harga <= 0) {
            alert("Harga produk wajib diisi dan harus lebih besar dari 0.");
            return;
        }
        if (isNaN(currentForm.stok) || currentForm.stok < 0) {
            alert("Stok wajib diisi dan tidak boleh negatif (minimal 0).");
            return;
        }

        setIsSubmitting(true);
        
        const menuItemData: MenuItem = {
            ...currentForm,
            id: editingId || 0,
        };

        try {
            if (editingId) {
                await UmkmRepository.updateMenuItem(editingId, menuItemData);
            } else {
                await UmkmRepository.addMenuItem(umkmId, menuItemData);
            }
            
            setEditingId(null);
            setCurrentForm(defaultMenuForm);
            if (fileInputRef.current) fileInputRef.current.value = '';
            await refreshMenus();

        } catch (err) {
            console.error("Gagal submit item:", err);
            alert("Gagal menyimpan item. Coba lagi.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditClick = (item: MenuItemFromDB) => {
        setEditingId(item.id);
        setCurrentForm({
            namaProduk: item.nama_produk,
            deskripsiProduk: item.deskripsi_produk || '',
            harga: item.harga,
            stok: item.stok,
            fotoProduk: null 
        });
        window.scrollTo(0, 0);
    };

    const handleDeleteClick = async (itemId: number) => {
        if (!window.confirm("Anda yakin ingin menghapus menu ini?")) return;
        
        setIsSubmitting(true);
        try {
            await UmkmRepository.deleteMenuItem(itemId);
            await refreshMenus();
        } catch (err) {
            console.error("Gagal menghapus item:", err);
            alert("Gagal menghapus item. Coba lagi.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleCancelEdit = () => {
        setEditingId(null);
        setCurrentForm(defaultMenuForm);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }

    // --- Render ---
    if (isLoading) return <p>Loading data menu...</p>;
    if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

    return (
        <>
            <HeaderDefault />
            <section className="add-umkm-page">
                <div className="form-container">

                    <button onClick={() => navigate(`/detail-page/${umkmId}`)} className="back-button-page" disabled={isSubmitting}>
                        <i className="fa-solid fa-chevron-left"></i> Kembali ke Detail UMKM
                    </button>

                    <div className="form-header">
                        <h2>{editingId ? "Edit Menu" : "Tambah Menu Baru"}</h2>
                    </div>

                    {/* === Form untuk Add/Edit === */}
                    <form className="menu-add-form" onSubmit={handleSubmitItem}>
                        <fieldset disabled={isSubmitting}>
                            <div className="form-group">
                                <label htmlFor="fotoProduk">Foto Produk {editingId ? "(Kosongkan jika tidak ingin ganti)" : "(Opsional)"}</label>
                                <input type="file" id="fotoProduk" name="fotoProduk" onChange={handleMenuFileChange} accept="image/*" ref={fileInputRef} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="namaProduk">Nama Produk</label>
                                <input type="text" id="namaProduk" name="namaProduk" value={currentForm.namaProduk} onChange={handleMenuChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="deskripsiProduk">Deskripsi Produk (Opsional)</label>
                                <textarea id="deskripsiProduk" name="deskripsiProduk" value={currentForm.deskripsiProduk} onChange={handleMenuChange} rows={3} />
                            </div>
                            <div className="form-group-row">
                                <div className="form-group">
                                    <label htmlFor="harga">Harga (Rp)</label>
                                    <input type="number" id="harga" name="harga" value={currentForm.harga === 0 ? '' : currentForm.harga} onChange={handleMenuChange} min="1" placeholder="Contoh: 15000" required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="stok">Stok</label>
                                    <input type="number" id="stok" name="stok" value={currentForm.stok === 0 ? '' : currentForm.stok} onChange={handleMenuChange} min="0" placeholder="Contoh: 10" required />
                                </div>
                            </div>
                            <button type="submit" className="button-primary-add">
                                {isSubmitting ? "Menyimpan..." : (editingId ? "Update Item Menu" : "+ Tambah Item Menu Ini")}
                            </button>
                            {editingId && (
                                <button type="button" onClick={handleCancelEdit} className="button-secondary-add">
                                    Batal Edit
                                </button>
                            )}
                        </fieldset>
                    </form>

                    {/* === Daftar Menu yang Sudah Ada === */}
                    <div className="menu-list-preview">
                        <h3>Daftar Menu Saat Ini ({existingMenus.length})</h3>
                        {existingMenus.length === 0 ? (
                            <p className="empty-message">Anda belum menambahkan menu apapun.</p>
                        ) : (
                            existingMenus.map((item) => (
                                <div key={item.id} className="menu-item-preview">
                                    <div>
                                        <p><strong>{item.nama_produk}</strong> - Rp {item.harga.toLocaleString('id-ID')}</p>
                                        <p>Stok: {item.stok}</p>
                                    </div>
                                    <div className="menu-item-actions">
                                        <button onClick={() => handleEditClick(item)} disabled={isSubmitting} className='button-edit-menu'>Edit</button>
                                        <button onClick={() => handleDeleteClick(item.id)} disabled={isSubmitting} className="button-delete">Hapus</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    
                    {/* Tombol Selesai */}
                    <div className="form-navigation">
                         <button onClick={() => navigate(`/detail-page/${umkmId}`)} className="button-primary-add button-grey">
                            Selesai & Kembali
                        </button>
                    </div>

                </div>
            </section>
        </>
    );
}

export default FormEditMenu;