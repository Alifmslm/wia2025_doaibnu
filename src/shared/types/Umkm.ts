// File: src/shared/types/Umkm.ts

// --- Tipe-tipe LAMA (Untuk Form) INI TETAP DIPERLUKAN ---
export interface UmkmFormData {
    nama: string;
    kategori: 'Indonesia' | 'Asia' | 'Western' | 'Lain-lain' | '';
    deskripsi: string;
    lokasiGeneral: string;
    linkGmaps: string;
    gallery: File[];
}

export interface MenuItem {
    id: number;
    namaProduk: string;
    deskripsiProduk: string;
    harga: number;
    stok: number;
    fotoProduk: File | null;
}

export type Lokasi = {
    alamat: string;
    lokasi_general: string;
    latitude: number;
    longitude: number;
};
// --------------------------------------------------------


// --- TIPE-TIPE BARU (Untuk Data dari Supabase) ---

// Tipe untuk data dari tabel 'reviews'
export type ReviewFromDB = {
    id: number;
    user_id: string; // uuid
    umkm_id: number; // int8
    nilai: number; // float8
    komentar: string; // text
    created_at: string; // timestamptz
};

// Tipe untuk data dari tabel 'menu_items'
export type MenuItemFromDB = {
    id: number;
    umkm_id: number; // int8
    nama_produk: string; // text
    deskripsi_produk: string; // (Sudah diperbaiki)
    harga: number; // numeric
    stok: number; // int8
    foto_produk: string; // text (Ini adalah URL, bukan File)
    created_at: string; // timestamptz
};

/**
 * Tipe UTAMA untuk data UMKM yang diambil dari Supabase.
 */
export type UmkmFromDB = {
    id: number; // int8
    created_at: string; // timestamptz
    owner_id: string; // uuid
    nama: string; // text
    kategori: string; // text
    deskripsi: string; // text
    lokasi: Lokasi; // jsonb
    gambar_utama: string; // (Sudah diperbaiki)
    gallery: string[]; // jsonb (Array of URLs)
    total_visits: number; // int8
    monthly_visits: number; // int8
    average_rating: number; // float8
    menu_items: MenuItemFromDB[];
    reviews: ReviewFromDB[];
};

/**
 * Tipe data untuk OBJEK BARU yang akan di-insert ke tabel 'umkm'.
 */
export type NewUmkmData = Omit<
    UmkmFromDB, 
    'id' | 'created_at' | 'menu_items' | 'reviews'
>;