// src/shared/types/Umkm.ts
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
    kategori: "Makanan" | "Minuman" | "Jasa" | string;
    deskripsi?: string;
    lokasi?: Lokasi;
    gambarUtama?: string;
    gallery?: string[];
    ratings?: Rating[];
};
