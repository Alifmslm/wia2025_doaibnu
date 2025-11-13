export type Rating = {
    user: string;
    nilai: number;
    komentar?: string;
};

export type Lokasi = {
    alamat: string;
    lokasi_general: string;
    latitude: number;
    longitude: number;
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
    averageRating: number;
    monthlyEats: number;
    totalVisits: number; 
};