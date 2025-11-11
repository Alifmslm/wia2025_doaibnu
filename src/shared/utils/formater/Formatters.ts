/**
 * Memformat jumlah kunjungan. 
 * Jika lebih dari 999, akan ditampilkan sebagai "999+".
 * @param count - Jumlah kunjungan (number).
 * @returns Jumlah kunjungan yang diformat (string).
 */
export const formatVisits = (count: number): string => {
    if (typeof count !== 'number' || count < 0) {
        return "0";
    }
    
    if (count > 999) {
        return "999+";
    }
    return count.toString();
}