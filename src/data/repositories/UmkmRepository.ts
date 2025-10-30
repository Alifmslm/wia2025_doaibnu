// src/data/repositories/UmkmRepository.ts
import raw from "../mock/umkm.json";
import type { Umkm } from "../../shared/types/Umkm";

// simple in-memory "db"
const DB: Umkm[] = raw.umkm as Umkm[];

/**
 * Opsi: simulate network latency
 */
const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms));

export const UmkmRepository = {
    // synchronous (langsung)
    getAllSync(): Umkm[] {
        return DB;
    },

    getByIdSync(id: number): Umkm | undefined {
        return DB.find((u) => u.id === id);
    },

    // async versions (recommended for UI code)
    async getAll(): Promise<Umkm[]> {
        await delay(200); // simulate
        return DB;
    },

    async getById(id: number): Promise<Umkm | undefined> {
        await delay(150);
        return DB.find((u) => u.id === id);
    },

    async findByCategory(category: string): Promise<Umkm[]> {
        await delay(150);
        return DB.filter(
            (u) => u.kategori.toLowerCase() === category.toLowerCase()
        );
    },

    async search(q: string): Promise<Umkm[]> {
        await delay(150);
        const ql = q.trim().toLowerCase();
        if (!ql) return DB;
        return DB.filter(
            (u) =>
                u.nama.toLowerCase().includes(ql) ||
                (u.deskripsi || "").toLowerCase().includes(ql) ||
                (u.lokasi?.lokasi_general || "").toLowerCase().includes(ql)
        );
    },

    async paginate(
        page = 1,
        perPage = 10
    ): Promise<{ data: Umkm[]; total: number }> {
        await delay(150);
        const total = DB.length;
        const start = (page - 1) * perPage;
        const data = DB.slice(start, start + perPage);
        return { data, total };
    },

    // helper compute average rating
    getAverageRating(umkm: Umkm): number {
        const list = umkm.ratings || [];
        if (!list.length) return 0;
        const sum = list.reduce((s, r) => s + (r.nilai || 0), 0);
        return Math.round((sum / list.length) * 10) / 10; // satu desimal
    },
};
