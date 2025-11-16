import { useState, useEffect } from "react"; // Import useEffect

type FilterContainerProps = {
    title: string;
    labels: string[];
    onLabelClick?: (label: string) => void;
    selectedLabel?: string; // 👈 1. Prop baru: Menerima label yang dipilih dari induk
};

function FilterContainer({ title, labels, onLabelClick, selectedLabel }: FilterContainerProps) {
    // Kita masih menggunakan state internal untuk mengelola tampilan aktif, 
    // tetapi kita menginisialisasinya dan menyinkronkannya berdasarkan prop.
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    // 2. Gunakan useEffect untuk menyinkronkan activeIndex berdasarkan selectedLabel (dari PopUpFilter)
    useEffect(() => {
        if (!selectedLabel) {
            // Jika selectedLabel kosong/null (kondisi reset)
            setActiveIndex(null);
        } else {
            // Cari indeks label yang cocok dengan selectedLabel
            const index = labels.findIndex(label => label === selectedLabel);
            setActiveIndex(index >= 0 ? index : null);
        }
    }, [selectedLabel, labels]);

    // 3. Buat handler terpusat yang mengatur status dan memanggil callback
    const handleItemClick = (item: string, index: number) => {
        // Tentukan apakah item diklik lagi (toggle off) atau item baru
        const newIndex = activeIndex === index ? null : index;
        
        // Pilihan untuk dikirim ke parent
        const selectedValue = activeIndex === index ? "" : item; // Kirim "" jika di-toggle off

        setActiveIndex(newIndex); // Update tampilan lokal
        
        // Panggil callback ke parent
        if (onLabelClick) {
            onLabelClick(selectedValue);
        }
    };


    return (
        <section className="filter-container">
            <h1>{title}</h1>
            <div className="filter-label-container">
                {labels.map((item, index) => (
                    <button
                        key={index}
                        // 4. Gunakan activeIndex untuk menentukan kelas CSS
                        className={activeIndex === index ? "label-detail__on" : "label-detail"}
                        onClick={() => handleItemClick(item, index)} 
                    >
                        {item}
                    </button>
                ))}
            </div>
        </section>
    );
}

export default FilterContainer;