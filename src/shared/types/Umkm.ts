export type Rating = {
    user: string;
    nilai: number;
    komentar?: string;
};

export type Lokasi = {
    alamat: string;
    lokasi_general: string;
    map_embed?: string;
};

export type Umkm = {
    id: number;
    nama: string;
    kategori: string;
    deskripsi: string;
    lokasi: Lokasi;
    gambarUtama: string;
    gallery: string[];
    ratings: Rating[];
    // Properti baru
    monthlyEats: number;
    totalVisits: number; 
};