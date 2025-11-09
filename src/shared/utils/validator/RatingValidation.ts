export const ratingValidation = (value: string) => {
    // 1. Cek jika kosong
    if (value.trim() === "") {
        return "Rating tidak boleh kosong.";
    }

    if (isNaN(Number(value))) {
        return "Hanya boleh berisi angka (contoh: 4.5).";
    }

    // 3. Ubah ke angka dan cek jangkauannya
    const numericValue = Number(value);
    if (numericValue < 0 || numericValue > 5) {
        return "Nilai harus di antara 0.0 dan 5.0.";
    }

    return "";
};
