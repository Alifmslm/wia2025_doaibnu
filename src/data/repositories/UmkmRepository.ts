import { supabase } from '../../shared/supbase';
import type {
    Lokasi,
    UmkmFormData,
    MenuItem,
    MenuItemFromDB, // <-- DITAMBAHKAN, diperlukan untuk fungsi baru
    UmkmFromDB, 
    NewUmkmData 
} from "../../shared/types/Umkm";
import { type FormEditData } from '../../ui/page/FormEditUmkm'; 

const JOIN_QUERY = `
    *,
    menu_items ( * ),
    reviews ( * )
`;

// --- Listener (Tidak Berubah) ---
type DataChangeListener = () => void;
const visitedListeners: DataChangeListener[] = [];
// ----------------------------------------------------


// === FUNGSI HELPER BARU UNTUK UPLOAD GAMBAR ===
/**
 * Meng-upload file gambar ke Supabase Storage dan mengembalikan URL publiknya.
 * @param file - Objek File yang akan di-upload.
 * @param bucketName - Nama bucket Anda (cth: 'gambar-umkm').
 */
async function uploadImageAndGetUrl(file: File, bucketName: string): Promise<string> {
    
    // 1. Buat nama file yang unik
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `public/${fileName}`; 

    console.log(`Meng-upload file ke: ${bucketName}/${filePath}`);

    // 2. Upload file
    const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

    if (uploadError) {
        console.error("Error saat upload file:", uploadError);
        throw uploadError;
    }

    // 3. Ambil URL publik
    const { data } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

    if (!data.publicUrl) {
        throw new Error("Gagal mendapatkan URL publik setelah upload.");
    }
    
    console.log("Upload berhasil, URL:", data.publicUrl);
    return data.publicUrl;
}
// --- AKHIR FUNGSI HELPER BARU ---


// === FUNGSI HELPER LAMA (DIMODIFIKASI) ===
function mapFormDataToDb(
    formData: UmkmFormData, 
    ownerId: string,
    mainImageUrl: string,
    galleryImageUrls: string[]
): NewUmkmData {
    
    const newLokasi: Lokasi = {
        alamat: formData.linkGmaps,
        lokasi_general: formData.lokasiGeneral,
        latitude: 0,
        longitude: 0,
    };
    
    return {
        owner_id: ownerId, 
        nama: formData.nama,
        kategori: formData.kategori,
        deskripsi: formData.deskripsi,
        lokasi: newLokasi,
        gambar_utama: mainImageUrl,
        gallery: galleryImageUrls,
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
     * Meng-update data UMKM di database
     */
    async updateById(id: number, updateData: FormEditData, currentLokasi: Lokasi): Promise<UmkmFromDB> {
        console.log(`Meng-update UMKM dengan ID: ${id}`);
        const updatedLokasi: Lokasi = {
            latitude: currentLokasi.latitude, longitude: currentLokasi.longitude,
            alamat: updateData.alamat, lokasi_general: updateData.lokasiGeneral
        };
        const dataToUpdate = {
            nama: updateData.nama, deskripsi: updateData.deskripsi,
            kategori: updateData.kategori, lokasi: updatedLokasi,
        };
        // Perlu .select() agar mengembalikan data yang diupdate
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
     * Menghitung rata-rata rating.
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


    // === FUNGSI BARU UNTUK EDIT MENU ===

    /**
     * Menambahkan SATU item menu baru ke UMKM
     */
    async addMenuItem(umkmId: number, item: MenuItem): Promise<MenuItemFromDB> {
        console.log(`Menambahkan menu baru ke UMKM ID: ${umkmId}`);
        const BUCKET_NAME = 'gambar-umkm'; // Pastikan nama bucket benar
        let fotoProdukUrl = "/images/menu_default.png";

        // 1. Upload foto jika ada
        if (item.fotoProduk) {
            try {
                fotoProdukUrl = await uploadImageAndGetUrl(item.fotoProduk, BUCKET_NAME);
            } catch (uploadErr) {
                console.error("Gagal upload foto menu:", uploadErr);
                // Gagal upload tidak menghentikan proses, pakai foto default
            }
        }

        // 2. Siapkan data untuk di-insert
        const newMenuItemData = {
            umkm_id: umkmId,
            nama_produk: item.namaProduk,
            deskripsi_produk: item.deskripsiProduk,
            harga: item.harga,
            stok: item.stok,
            foto_produk: fotoProdukUrl
        };

        // 3. Insert ke database
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

    /**
     * Meng-update SATU item menu
     */
    async updateMenuItem(menuItemId: number, item: MenuItem): Promise<MenuItemFromDB> {
        console.log(`Meng-update menu ID: ${menuItemId}`);
        const BUCKET_NAME = 'gambar-umkm';
        
        // 1. Siapkan data update (tanpa foto dulu)
        const dataToUpdate: Partial<MenuItemFromDB> = {
            nama_produk: item.namaProduk,
            deskripsi_produk: item.deskripsiProduk,
            harga: item.harga,
            stok: item.stok,
        };

        // 2. Cek jika ada file foto BARU
        // (Jika item.fotoProduk adalah 'null', kita tidak ubah fotonya)
        if (item.fotoProduk) {
             try {
                dataToUpdate.foto_produk = await uploadImageAndGetUrl(item.fotoProduk, BUCKET_NAME);
            } catch (uploadErr) {
                console.error("Gagal upload foto menu baru:", uploadErr);
                // Jangan gagalkan update jika hanya foto yg gagal
            }
        }

        // 3. Update database
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

    /**
     * Menghapus SATU item menu
     */
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
    }
    
    // === AKHIR FUNGSI BARU ===
};