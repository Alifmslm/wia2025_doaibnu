import { supabase } from '../../shared/supbase'; // 1. Impor koneksi Supabase Anda
import type {
    Lokasi,
    UmkmFormData,
    MenuItem,
    UmkmFromDB, // Tipe lengkap
    NewUmkmData // Tipe untuk data baru
} from "../../shared/types/Umkm";

const JOIN_QUERY = `
    *,
    menu_items ( * ),
    reviews ( * )
`;

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
     * Beserta data 'menu_items' dan 'reviews' yang terhubung
     */
    async getAll(): Promise<UmkmFromDB[]> { 
        console.log("Mengambil semua UMKM dari Supabase...");
        
        const { data, error } = await supabase
            .from('umkm')
            .select(JOIN_QUERY); // Gunakan konstanta JOIN_QUERY

        if (error) {
            console.error("Error mengambil data:", error);
            throw error;
        }
        
        return data as UmkmFromDB[]; 
    },

    // --- FUNGSI BARU UNTUK FILTER ---

    /**
     * Mencari UMKM berdasarkan nama atau deskripsi
     */
    async search(q: string): Promise<UmkmFromDB[]> {
        console.log(`Mencari UMKM dengan query: ${q}`);
        const queryStr = `%${q}%`; // Format untuk query 'ilike'

        const { data, error } = await supabase
            .from('umkm')
            .select(JOIN_QUERY)
            // 'or' untuk mencari di 'nama' ATAU 'deskripsi'
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
            .eq('kategori', category); // 'eq' untuk pencocokan persis

        if (error) {
            console.error("Error saat filter kategori:", error);
            throw error;
        }
        return data as UmkmFromDB[];
    },

    // --- FUNGSI LAMA DIPERBARUI ---

    /**
     * Menghitung rata-rata rating.
     * Logika ini sekarang bisa diganti karena DB sudah menyediakannya.
     */
    getAverageRating(umkm: UmkmFromDB): number {
        // Kita bisa langsung pakai data dari DB
        if (umkm.average_rating) {
            return umkm.average_rating;
        }
        
        // Atau hitung manual jika perlu
        const list = umkm.reviews || [];
        if (!list.length) return 0;
        const sum = list.reduce((s, r) => s + (r.nilai || 0), 0);
        return Math.round((sum / list.length) * 10) / 10;
    },

    /**
     * Mengecek apakah UMKM disimpan.
     * FITUR INI BELUM BERFUNGSI sampai Autentikasi dibuat.
     * Kita buat mock 'return false' agar tidak error.
     */
    isSaved(id: number): boolean {
        // TODO: Implementasi ini setelah 'saved_umkm' dan Auth terhubung
        // console.warn(`Pengecekan 'isSaved' untuk ID: ${id} belum diimplementasi.`);
        return false; 
    },

    /**
     * Menambahkan UMKM baru DAN menu-menunya ke Supabase
     */
    async addMyUmkm(formData: UmkmFormData, menuItems: MenuItem[]): Promise<UmkmFromDB> { 
        console.log("Menambahkan UMKM baru ke Supabase...");
        
        const FAKE_USER_ID = "11111111-1111-1111-1111-111111111111"; 

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