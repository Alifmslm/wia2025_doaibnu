// src/data/repositories/UmkmRepository.ts
import { supabase } from '../../shared/supbase';
import type {
    Lokasi,
    UmkmFormData,
    MenuItem,
    UmkmFromDB, // Tipe lengkap
    NewUmkmData // Tipe untuk data baru
} from "../../shared/types/Umkm";
// Impor ini dengan path yang benar
import { type FormEditData } from '../../ui/page/FormEditUmkm'; 

const JOIN_QUERY = `
    *,
    menu_items ( * ),
    reviews ( * )
`;

// ID user mock dari data CSV Anda
const FAKE_USER_ID = "11111111-1111-1111-1111-111111111111"; 

// --- Listener untuk 'Visited' (Kode ini sudah benar) ---
type DataChangeListener = () => void;
const visitedListeners: DataChangeListener[] = [];
// ----------------------------------------------------

// Fungsi helper ini sekarang mengembalikan tipe 'NewUmkmData' yang spesifik
function mapFormDataToDb(formData: UmkmFormData, ownerId: string): NewUmkmData {
    const newLokasi: Lokasi = {
        alamat: formData.linkGmaps,
        lokasi_general: formData.lokasiGeneral,
        latitude: 0,
        longitude: 0,
    };
    
    const HARDCODED_IMAGE_URL = "/images/gallery-image-1.png"; 

    return {
        owner_id: ownerId, 
        nama: formData.nama,
        kategori: formData.kategori,
        deskripsi: formData.deskripsi,
        lokasi: newLokasi,
        gambar_utama: HARDCODED_IMAGE_URL,
        gallery: [HARDCODED_IMAGE_URL],
        total_visits: 0,
        monthly_visits: 0,
        average_rating: 0,
    };
}

export const UmkmRepository = {

    /**
     * Mengambil SEMUA UMKM dari database Supabase
     */
    async getAll(): Promise<UmkmFromDB[]> { 
        console.log("Mengambil semua UMKM dari Supabase...");
        
        const { data, error } = await supabase
            .from('umkm')
            .select(JOIN_QUERY); 

        if (error) {
            console.error("Error mengambil data:", error);
            throw error;
        }
        
        return data as UmkmFromDB[]; 
    },

    /**
     * Mengambil SATU UMKM berdasarkan ID-nya
     */
    async getById(id: number): Promise<UmkmFromDB | null> {
        console.log(`Mengambil UMKM dengan ID: ${id}`);
        
        const { data, error } = await supabase
            .from('umkm')
            .select(JOIN_QUERY) 
            .eq('id', id) 
            .single(); 

        if (error) {
            console.error("Error mengambil data by ID:", error);
            if (error.code === 'PGRST116') return null;
            throw error;
        }
        
        return data as UmkmFromDB;
    },

    /**
     * Meng-update data UMKM di database
     */
    async updateById(id: number, updateData: FormEditData, currentLokasi: Lokasi): Promise<UmkmFromDB> {
        console.log(`Meng-update UMKM dengan ID: ${id}`);
        
        const updatedLokasi: Lokasi = {
            latitude: currentLokasi.latitude,
            longitude: currentLokasi.longitude,
            alamat: updateData.alamat,
            lokasi_general: updateData.lokasiGeneral
        };

        const dataToUpdate = {
            nama: updateData.nama,
            deskripsi: updateData.deskripsi,
            kategori: updateData.kategori,
            lokasi: updatedLokasi,
        };

        const { data, error } = await supabase
            .from('umkm')
            .update(dataToUpdate) 
            .eq('id', id) 
            .select() 
            .single();

        if (error) {
            console.error("Error meng-update data:", error);
            throw error;
        }
        
        return data as UmkmFromDB;
    },

    /**
     * Mencari UMKM berdasarkan nama atau deskripsi
     */
    async search(q: string): Promise<UmkmFromDB[]> {
        console.log(`Mencari UMKM dengan query: ${q}`);
        const queryStr = `%${q}%`;

        const { data, error } = await supabase
            .from('umkm')
            .select(JOIN_QUERY)
            .or(`nama.ilike.${queryStr},deskripsi.ilike.${queryStr}`);

        if (error) {
            console.error("Error saat mencari data:", error);
            throw error;
        }
        return data as UmkmFromDB[];
    },

    /**
     * Mencari UMKM berdasarkan kategori
     */
    async findByCategory(category: string): Promise<UmkmFromDB[]> {
        console.log(`Mencari UMKM dengan kategori: ${category}`);

        const { data, error } = await supabase
            .from('umkm')
            .select(JOIN_QUERY)
            .eq('kategori', category); 

        if (error) {
            console.error("Error saat filter kategori:", error);
            throw error;
        }
        return data as UmkmFromDB[];
    },

    /**
     * Menghitung rata-rata rating.
     */
    getAverageRating(umkm: UmkmFromDB): number {
        if (!umkm) return 0;
        if (umkm.average_rating) {
            return umkm.average_rating;
        }
        
        const list = umkm.reviews || [];
        if (!list.length) return 0;
        const sum = list.reduce((s, r) => s + (r.nilai || 0), 0);
        return Math.round((sum / list.length) * 10) / 10;
    },

    // --- FUNGSI SAVE & VISIT (YANG BARU) ---

    /**
     * Mengecek apakah UMKM disimpan oleh user (mock)
     * (Kita belum bisa cek ini tanpa ID user asli)
     */
    isSaved(id: number): boolean {
        // TODO: Implementasi ini setelah Auth
        // console.warn(`Pengecekan 'isSaved' untuk ID: ${id} belum diimplementasi.`);
        return false; // Selalu kembalikan false untuk saat ini
    },
    
    /**
     * Menyimpan UMKM ke tabel 'saved_umkm'
     */
    async save(id: number): Promise<void> {
        console.log(`Menyimpan UMKM ID: ${id} untuk user: ${FAKE_USER_ID}`);
        const { error } = await supabase
            .from('saved_umkm')
            .insert({
                user_id: FAKE_USER_ID,
                umkm_id: id
            });
        
        if (error) {
            console.error("Error menyimpan UMKM:", error);
            throw error;
        }
    },

    /**
     * Menghapus UMKM dari tabel 'saved_umkm'
     */
    async unsave(id: number): Promise<void> {
         console.log(`Menghapus UMKM ID: ${id} untuk user: ${FAKE_USER_ID}`);
         const { error } = await supabase
            .from('saved_umkm')
            .delete()
            .eq('user_id', FAKE_USER_ID)
            .eq('umkm_id', id);
        
        if (error) {
            console.error("Error menghapus (unsave) UMKM:", error);
            throw error;
        }
    },

    /**
     * Mengambil data UMKM LENGKAP berdasarkan ID yang disimpan
     */
    async getSavedUmkms(): Promise<UmkmFromDB[]> {
        console.log(`Mengambil UMKM tersimpan untuk user: ${FAKE_USER_ID}`);
        
        // Query ini: "SELECT umkm.*, ... FROM saved_umkm JOIN umkm ON ... WHERE user_id = FAKE_USER_ID"
        const { data, error } = await supabase
            .from('saved_umkm')
            .select(`
                umkm ( ${JOIN_QUERY} )
            `)
            .eq('user_id', FAKE_USER_ID);

        if (error) {
            console.error("Error mengambil UMKM tersimpan:", error);
            throw error;
        }

        // Data yang kembali berbentuk: [ { umkm: {...} }, { umkm: {...} } ]
        // Kita perlu 'meratakan' (flatten) array tersebut
        return data.map(item => item.umkm) as UmkmFromDB[];
    },

    /**
     * Mengambil data UMKM LENGKAP berdasarkan ID yang dikunjungi
     */
    async getVisitedUmkms(): Promise<UmkmFromDB[]> {
         console.log(`Mengambil UMKM dikunjungi untuk user: ${FAKE_USER_ID}`);
        
        const { data, error } = await supabase
            .from('visited_umkm')
            .select(`
                umkm ( ${JOIN_QUERY} )
            `)
            .eq('user_id', FAKE_USER_ID);

        if (error) {
            console.error("Error mengambil UMKM dikunjungi:", error);
            throw error;
        }

        return data.map(item => item.umkm) as UmkmFromDB[];
    },

    /**
     * Memindahkan UMKM dari 'saved' ke 'visited'
     */
    async moveToVisited(id: number): Promise<void> {
        console.log(`Memindahkan UMKM ID: ${id} ke 'dikunjungi'`);
        
        // 1. Hapus dari daftar 'Saved'
        await this.unsave(id);

        // 2. Tambahkan ke daftar 'Visited'
        const { error: visitError } = await supabase
            .from('visited_umkm')
            .insert({
                user_id: FAKE_USER_ID,
                umkm_id: id
            });
        
        if (visitError) {
             console.error("Gagal menambah ke 'visited':", visitError);
             // Abaikan error 'duplicate key' jika sudah pernah dikunjungi
             if (visitError.code !== '23505') { 
                throw visitError;
             }
        }
        
        // 3. Tambahkan ke counter publik (totalVisits)
        // Kita gunakan 'rpc' untuk memanggil fungsi database
        const { error: rpcError } = await supabase.rpc('increment_visits', { umkm_id_to_inc: id });
        if (rpcError) {
            console.error("Gagal meng-increment visit count:", rpcError);
        }

        // 4. Beri tahu listener (jika ada) bahwa data berubah
        this.emitVisitedDataChange();
    },
    
    // --- Listener (Tidak Berubah) ---
    onVisitedDataChange(listener: DataChangeListener): () => void {
        visitedListeners.push(listener);
        return () => {
            const index = visitedListeners.indexOf(listener);
            if (index > -1) {
                visitedListeners.splice(index, 1);
            }
        };
    },
    emitVisitedDataChange(): void {
        visitedListeners.forEach(listener => listener());
    },

    // --- addMyUmkm (Tidak Berubah) ---
    async addMyUmkm(formData: UmkmFormData, menuItems: MenuItem[]): Promise<UmkmFromDB> { 
        console.log("Menambahkan UMKM baru ke Supabase...");
        
        const umkmBaru: NewUmkmData = mapFormDataToDb(formData, FAKE_USER_ID);

        const { data: umkmData, error: umkmError } = await supabase
            .from('umkm')
            .insert(umkmBaru) 
            .select() 
            .single();

        if (umkmError) {
            console.error("Error menambah UMKM:", umkmError);
            throw umkmError;
        }

        if (menuItems.length > 0) {
            const menuDataBaru = menuItems.map(menu => ({
                umkm_id: umkmData.id, 
                nama_produk: menu.namaProduk,
                deskripsi_produk: menu.deskripsiProduk,
                harga: menu.harga,
                stok: menu.stok,
                foto_produk: "/images/menu_default.png"
            }));

            const { error: menuError } = await supabase
                .from('menu_items')
                .insert(menuDataBaru);

            if (menuError) {
                console.error("Gagal menambah menu:", menuError);
                throw menuError;
            }
        }

        console.log("Data UMKM dan Menu berhasil ditambahkan:", umkmData);
        
        return {
            ...umkmData,
            menu_items: [], 
            reviews: []     
        } as UmkmFromDB;
    }
};