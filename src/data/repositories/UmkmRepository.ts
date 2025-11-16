import { supabase } from '../../shared/supbase';
import type {
    Lokasi,
    UmkmFormData,
    MenuItem,       // Tipe form (File | null)
    MenuItemFromDB, // Tipe DB (string url)
    UmkmFromDB, 
    NewUmkmData,
    ReviewFromDB    // Tipe DB (dari join)
} from "../../shared/types/Umkm";
import { type FormEditData } from '../../ui/page/FormEditUmkm'; 

// JOIN_QUERY ini mengambil UMKM, semua menu, dan semua ulasan
// TERMASUK username pembuat ulasan dari tabel 'profiles'
const JOIN_QUERY = `
    *,
    menu_items ( * ),
    reviews ( 
        *, 
        profiles ( username ) 
    )
`;

// --- Listener (Tidak Berubah) ---
type DataChangeListener = () => void;
const visitedListeners: DataChangeListener[] = [];
// ----------------------------------------------------


// === FUNGSI HELPER: UPLOAD GAMBAR ===
// (Fungsi ini tidak berubah)
async function uploadImageAndGetUrl(file: File, bucketName: string): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `public/${fileName}`; 
    console.log(`Meng-upload file ke: ${bucketName}/${filePath}`);
    const { error: uploadError } = await supabase.storage.from(bucketName).upload(filePath, file);
    if (uploadError) { console.error("Error saat upload file:", uploadError); throw uploadError; }
    const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
    if (!data.publicUrl) { throw new Error("Gagal mendapatkan URL publik setelah upload."); }
    console.log("Upload berhasil, URL:", data.publicUrl);
    return data.publicUrl;
}
// --- AKHIR FUNGSI HELPER ---


// === FUNGSI HELPER: MAP DATA FORM KE DB (MODIFIKASI) ===
function mapFormDataToDb(
    formData: UmkmFormData, 
    ownerId: string,
    mainImageUrl: string,
    galleryImageUrls: string[]
): NewUmkmData {
    
    const newLokasi: Lokasi = {
        alamat: formData.linkGmaps,             // Ini adalah link Gmaps
        lokasi_general: formData.lokasiGeneral,
        alamat_lengkap: formData.alamatLengkap, // <-- TAMBAHKAN INI
        latitude: 0,
        longitude: 0,
    };
    
    return {
        owner_id: ownerId, 
        nama: formData.nama,
        kategori: formData.kategori,
        deskripsi: formData.deskripsi,
        lokasi: newLokasi, // <-- Objek 'lokasi' sekarang berisi alamat lengkap
        gambar_utama: mainImageUrl,
        gallery: galleryImageUrls,
        total_visits: 0,
        monthly_visits: 0,
        average_rating: 0,
    };
}

export const UmkmRepository = {

    /**
     * Mengambil SEMUA UMKM
     */
    async getAll(): Promise<UmkmFromDB[]> { 
        console.log("Mengambil semua UMKM dari Supabase...");
        const { data, error } = await supabase.from('umkm').select(JOIN_QUERY); 
        if (error) { console.error("Error mengambil data:", error); throw error; }
        return data as UmkmFromDB[]; 
    },

    /**
     * Mengambil SATU UMKM berdasarkan ID-nya
     */
    async getById(id: number): Promise<UmkmFromDB | null> {
        console.log(`Mengambil UMKM dengan ID: ${id}`);
        const { data, error } = await supabase.from('umkm').select(JOIN_QUERY).eq('id', id).single(); 
        if (error) {
            console.error("Error mengambil data by ID:", error);
            if (error.code === 'PGRST116') return null;
            throw error;
        }
        return data as UmkmFromDB;
    },

    /**
     * Meng-update data UMKM (Info Utama)
     */
    async updateById(id: number, updateData: FormEditData, currentLokasi: Lokasi): Promise<UmkmFromDB> {
        console.log(`Meng-update UMKM dengan ID: ${id}`);
        // CATATAN: 'lokasi' di sini belum menyertakan 'alamat_lengkap'
        // Anda perlu memperbarui tipe FormEditData dan form edit nanti
        const updatedLokasi: Lokasi = {
            latitude: currentLokasi.latitude, 
            longitude: currentLokasi.longitude,
            alamat: updateData.alamat, 
            lokasi_general: updateData.lokasiGeneral,
            alamat_lengkap: currentLokasi.alamat_lengkap // Pertahankan alamat lengkap yg lama
        };
        const dataToUpdate = {
            nama: updateData.nama, deskripsi: updateData.deskripsi,
            kategori: updateData.kategori, lokasi: updatedLokasi,
        };
        const { data, error } = await supabase.from('umkm').update(dataToUpdate).eq('id', id).select().single();
        if (error) { console.error("Error meng-update data:", error); throw error; }
        return data as UmkmFromDB;
    },

    /**
     * Mencari UMKM berdasarkan nama atau deskripsi
     */
    async search(q: string): Promise<UmkmFromDB[]> {
        console.log(`Mencari UMKM dengan query: ${q}`);
        const queryStr = `%${q}%`;
        const { data, error } = await supabase.from('umkm').select(JOIN_QUERY).or(`nama.ilike.${queryStr},deskripsi.ilike.${queryStr}`);
        if (error) { console.error("Error saat mencari data:", error); throw error; }
        return data as UmkmFromDB[];
    },

    /**
     * Mencari UMKM berdasarkan kategori
     */
    async findByCategory(category: string): Promise<UmkmFromDB[]> {
        console.log(`Mencari UMKM dengan kategori: ${category}`);
        const { data, error } = await supabase.from('umkm').select(JOIN_QUERY).eq('kategori', category); 
        if (error) { console.error("Error saat filter kategori:", error); throw error; }
        return data as UmkmFromDB[];
    },

    /**
     * Menghitung rata-rata rating (helper sisi klien)
     */
    getAverageRating(umkm: UmkmFromDB): number {
        if (!umkm) return 0;
        if (umkm.average_rating) { return umkm.average_rating; }
        const list = umkm.reviews || [];
        if (!list.length) return 0;
        const sum = list.reduce((s, r) => s + (r.nilai || 0), 0);
        return Math.round((sum / list.length) * 10) / 10;
    },

    // --- FUNGSI SAVE & VISIT ---
    async isSaved(id: number, userId: string): Promise<boolean> {
        const { data, error } = await supabase.from('saved_umkm').select('umkm_id').eq('user_id', userId).eq('umkm_id', id).maybeSingle(); 
        if (error) { console.error("Error mengecek 'isSaved':", error); return false; }
        return !!data;
    },
    async save(id: number, userId: string): Promise<void> {
        console.log(`Menyimpan UMKM ID: ${id} untuk user: ${userId}`);
        const { error } = await supabase.from('saved_umkm').insert({ user_id: userId, umkm_id: id });
        if (error) { console.error("Error menyimpan UMKM:", error); throw error; }
    },
    async unsave(id: number, userId: string): Promise<void> {
         console.log(`Menghapus UMKM ID: ${id} untuk user: ${userId}`);
         const { error } = await supabase.from('saved_umkm').delete().eq('user_id', userId).eq('umkm_id', id);
        if (error) { console.error("Error menghapus (unsave) UMKM:", error); throw error; }
    },
    async getSavedUmkms(userId: string): Promise<UmkmFromDB[]> {
        console.log(`Mengambil UMKM tersimpan untuk user: ${userId}`);
        const { data, error } = await supabase.from('saved_umkm').select(`umkm ( ${JOIN_QUERY} )`).eq('user_id', userId);
        if (error) { console.error("Error mengambil UMKM tersimpan:", error); throw error; }
        return data.map(item => item.umkm) as UmkmFromDB[];
    },
    async getVisitedUmkms(userId: string): Promise<UmkmFromDB[]> {
         console.log(`Mengambil UMKM dikunjungi untuk user: ${userId}`);
        const { data, error } = await supabase.from('visited_umkm').select(`umkm ( ${JOIN_QUERY} )`).eq('user_id', userId);
        if (error) { console.error("Error mengambil UMKM dikunjungi:", error); throw error; }
        return data.map(item => item.umkm) as UmkmFromDB[];
    },
    async getByOwnerId(userId: string): Promise<UmkmFromDB[]> {
        console.log(`Mengambil UMKM milik user: ${userId}`);
        const { data, error } = await supabase
            .from('umkm')
            .select(JOIN_QUERY)
            .eq('owner_id', userId);
        if (error) {
            console.error("Error mengambil data by owner:", error);
            throw error;
        }
        return data as UmkmFromDB[]; 
    },
    async moveToVisited(id: number, userId: string): Promise<void> {
        console.log(`Memindahkan UMKM ID: ${id} ke 'dikunjungi'`);
        await this.unsave(id, userId);
        const { error: visitError } = await supabase.from('visited_umkm').upsert({ user_id: userId, umkm_id: id }, { ignoreDuplicates: true });
        if (visitError) { console.error("Gagal menambah ke 'visited':", visitError); throw visitError; }
        const { error: rpcError } = await supabase.rpc('increment_visits', { umkm_id_to_inc: id });
        if (rpcError) { console.error("Gagal meng-increment visit count:", rpcError); }
        this.emitVisitedDataChange();
    },
    
    // --- Listener ---
    onVisitedDataChange(listener: DataChangeListener): () => void {
        visitedListeners.push(listener);
        return () => {
            const index = visitedListeners.indexOf(listener);
            if (index > -1) { visitedListeners.splice(index, 1); }
        };
    },
    emitVisitedDataChange(): void {
        visitedListeners.forEach(listener => listener());
    },

    // --- FUNGSI CREATE UMKM ---
    async addMyUmkm(
        formData: UmkmFormData, 
        menuItems: MenuItem[], 
        ownerId: string
    ): Promise<UmkmFromDB> { 
        
        console.log(`Menambahkan UMKM baru untuk user: ${ownerId}`);
        const BUCKET_NAME = 'gambar-umkm'; 

        // 1. UPLOAD GAMBAR UMKM
        if (formData.gallery.length === 0) {
            throw new Error("Minimal harus ada 1 gambar di galeri.");
        }
        const galleryUploadPromises = formData.gallery.map(file => 
            uploadImageAndGetUrl(file, BUCKET_NAME)
        );
        const galleryImageUrls = await Promise.all(galleryUploadPromises);
        const mainImageUrl = galleryImageUrls[0]; 

        // 2. SIAPKAN DATA UMKM
        const umkmBaru: NewUmkmData = mapFormDataToDb(
            formData, 
            ownerId, 
            mainImageUrl, 
            galleryImageUrls
        );

        // 3. INSERT DATA UMKM
        const { data: umkmData, error: umkmError } = await supabase
            .from('umkm')
            .insert(umkmBaru) 
            .select() 
            .single();

        if (umkmError) {
            console.error("Error menambah UMKM:", umkmError);
            throw umkmError;
        }

        // 4. UPLOAD GAMBAR MENU
        if (menuItems.length > 0) {
            const menuUploadPromises = menuItems.map(async (menu) => {
                let fotoProdukUrl = "/images/menu_default.png";
                if (menu.fotoProduk) {
                    try {
                        fotoProdukUrl = await uploadImageAndGetUrl(menu.fotoProduk, BUCKET_NAME);
                    } catch (uploadErr) {
                        console.error(`Gagal upload foto menu ${menu.namaProduk}:`, uploadErr);
                    }
                }
                return {
                    umkm_id: umkmData.id, 
                    nama_produk: menu.namaProduk,
                    deskripsi_produk: menu.deskripsiProduk,
                    harga: menu.harga,
                    stok: menu.stok,
                    foto_produk: fotoProdukUrl
                };
            });
            
            const menuDataBaru = await Promise.all(menuUploadPromises);

            // 5. INSERT DATA MENU
            const { error: menuError } = await supabase
                .from('menu_items')
                .insert(menuDataBaru);

            if (menuError) {
                console.error("Gagal menambah menu:", menuError);
            }
        }

        console.log("Data UMKM dan Menu berhasil ditambahkan:", umkmData);
        
        return {
            ...umkmData,
            menu_items: [], 
            reviews: []     
        } as UmkmFromDB;
    },


    // === FUNGSI EDIT MENU ===
    async addMenuItem(umkmId: number, item: MenuItem): Promise<MenuItemFromDB> {
        console.log(`Menambahkan menu baru ke UMKM ID: ${umkmId}`);
        const BUCKET_NAME = 'gambar-umkm'; 
        let fotoProdukUrl = "/images/menu_default.png";

        if (item.fotoProduk) {
            try {
                fotoProdukUrl = await uploadImageAndGetUrl(item.fotoProduk, BUCKET_NAME);
            } catch (uploadErr) {
                console.error("Gagal upload foto menu:", uploadErr);
            }
        }
        const newMenuItemData = {
            umkm_id: umkmId,
            nama_produk: item.namaProduk,
            deskripsi_produk: item.deskripsiProduk,
            harga: item.harga,
            stok: item.stok,
            foto_produk: fotoProdukUrl
        };
        const { data, error } = await supabase
            .from('menu_items')
            .insert(newMenuItemData)
            .select()
            .single();
        if (error) {
            console.error("Gagal menambah item menu:", error);
            throw error;
        }
        return data as MenuItemFromDB;
    },
    async updateMenuItem(menuItemId: number, item: MenuItem): Promise<MenuItemFromDB> {
        console.log(`Meng-update menu ID: ${menuItemId}`);
        const BUCKET_NAME = 'gambar-umkm';
        
        const dataToUpdate: Partial<MenuItemFromDB> = {
            nama_produk: item.namaProduk,
            deskripsi_produk: item.deskripsiProduk,
            harga: item.harga,
            stok: item.stok,
        };

        if (item.fotoProduk) {
             try {
                dataToUpdate.foto_produk = await uploadImageAndGetUrl(item.fotoProduk, BUCKET_NAME);
            } catch (uploadErr) {
                console.error("Gagal upload foto menu baru:", uploadErr);
            }
        }

        const { data, error } = await supabase
            .from('menu_items')
            .update(dataToUpdate)
            .eq('id', menuItemId)
            .select()
            .single();
        if (error) {
            console.error("Gagal meng-update item menu:", error);
            throw error;
        }
        return data as MenuItemFromDB;
    },
    async deleteMenuItem(menuItemId: number): Promise<void> {
        console.log(`Menghapus menu ID: ${menuItemId}`);
        const { error } = await supabase
            .from('menu_items')
            .delete()
            .eq('id', menuItemId);
        if (error) {
            console.error("Gagal menghapus item menu:", error);
            throw error;
        }
    },
    
    
    // === FUNGSI TAMBAH REVIEW ===
    async addReview(
        umkmId: number, 
        userId: string, 
        nilai: number, 
        komentar: string
    ): Promise<ReviewFromDB> {
        
        console.log(`Menambahkan ulasan baru untuk UMKM ID: ${umkmId} dari user: ${userId}`);

        const newReviewData = {
            umkm_id: umkmId,
            user_id: userId,
            nilai: nilai,
            komentar: komentar
        };

        const { data, error } = await supabase
            .from('reviews')
            .insert(newReviewData)
            .select(`
                *,
                profiles ( username )
            `)
            .single();

        if (error) {
            console.error("Gagal menambah ulasan:", error);
            if (error.code === '42501') {
                throw new Error("Gagal menyimpan ulasan. Anda mungkin tidak diizinkan memberi ulasan.");
            }
            throw error;
        }
        
        // TODO: Setelah review berhasil, panggil RPC untuk update 'average_rating' di tabel 'umkm'
        // await supabase.rpc('update_average_rating', { umkm_id_param: umkmId });

        return data as ReviewFromDB;
    }
};