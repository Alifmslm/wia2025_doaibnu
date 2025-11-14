// src/data/repositories/UmkmRepository.ts
import raw from "../mock/Umkm.json";
import type { Umkm } from "../../shared/types/Umkm";

const DB: Umkm[] = raw.umkm as Umkm[]; // simple in-memory "db"
const SAVED_KEY = "saved_umkms";
const VISITED_KEY = "visited_umkms";

// type VisitCountUpdater = (newCount: number) => void;
type DataChangeListener = () => void;
const visitedListeners: DataChangeListener[] = []; // Array untuk menyimpan semua fungsi refresh

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

    getAverageRating(umkm: Umkm): number {
        const list = umkm.ratings || [];
        if (!list.length) return 0;
        const sum = list.reduce((s, r) => s + (r.nilai || 0), 0);
        return Math.round((sum / list.length) * 10) / 10; // satu desimal
    },

    onVisitedDataChange(listener: DataChangeListener): () => void {
        visitedListeners.push(listener);
        // Mengembalikan fungsi untuk membersihkan listener saat komponen di-unmount
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

    // === METODE BARU UNTUK FUNGSI "SIMPAN" ===

    /**
     * Mengambil array ID yang disimpan dari localStorage (sinkron)
     */
    getSavedIds(): number[] {
        try {
            const data = localStorage.getItem(SAVED_KEY);
            return data ? (JSON.parse(data) as number[]) : [];
        } catch (e) {
            console.error("Gagal membaca saved IDs dari localStorage", e);
            return [];
        }
    },

    /**
     * Mengecek apakah sebuah ID sudah disimpan (sinkron)
     */
    isSaved(id: number): boolean {
        const ids = this.getSavedIds();
        return ids.includes(id);
    },

    /**
     * Menyimpan sebuah ID UMKM (sinkron)
     */
    save(id: number): void {
        const ids = this.getSavedIds();
        if (!ids.includes(id)) {
            ids.push(id);
            localStorage.setItem(SAVED_KEY, JSON.stringify(ids));
        }
    },

    /**
     * Menghapus sebuah ID UMKM dari simpanan (sinkron)
     */
    unsave(id: number): void {
        let ids = this.getSavedIds();
        ids = ids.filter(i => i !== id);
        localStorage.setItem(SAVED_KEY, JSON.stringify(ids));
    },

    /**
     * Mengambil data UMKM LENGKAP berdasarkan ID yang disimpan (asinkron)
     */
    async getSavedUmkms(): Promise<Umkm[]> {
        await delay(50); // Simulasi cepat
        const ids = this.getSavedIds();
        // Memfilter DB di memori berdasarkan ID dari localStorage
        return DB.filter(umkm => ids.includes(umkm.id));
    },

    getVisitedIds(): number[] {
        try {
            const data = localStorage.getItem(VISITED_KEY);
            return data ? (JSON.parse(data) as number[]) : [];
        } catch (e) {
            console.error("Gagal membaca visited IDs dari localStorage", e);
            return [];
        }
    },

    async getVisitedUmkms(): Promise<Umkm[]> {
        await delay(50);
        const ids = this.getVisitedIds();
        return DB.filter(umkm => ids.includes(umkm.id));
    },

    /**
     * FITUR UTAMA: Memindahkan dari 'Disimpan' ke 'Dikunjungi'
     */
    moveToVisited(id: number): void {
        // 1. Hapus dari daftar 'Saved'
        this.unsave(id);

        const visitedIds = this.getVisitedIds();
        if (!visitedIds.includes(id)) {
            visitedIds.push(id);
            localStorage.setItem(VISITED_KEY, JSON.stringify(visitedIds));
            
            // PENTING: Beri tahu komponen DikunjungiTabs bahwa ada perubahan data
            this.emitVisitedDataChange(); 
        }
        
        // 3. Tambahkan ke counter publik (totalVisits)
        this.incrementTotalVisits(id);
    },
    
    // === METODE BARU UNTUK MENGUPDATE COUNTER ===

    incrementTotalVisits(id: number): void {
        const umkmIndex = DB.findIndex(u => u.id === id);
        if (umkmIndex !== -1) {
            DB[umkmIndex].totalVisits += 1;
            const newCount = DB[umkmIndex].totalVisits;
            console.log(`UMKM ID ${id} totalVisits diperbarui menjadi ${newCount}`);
        } else {
            console.warn(`UMKM dengan ID ${id} tidak ditemukan.`);
        }
    }
};