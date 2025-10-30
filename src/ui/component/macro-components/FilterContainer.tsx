import { useState } from "react";

type FilterContainerProps = {
    title: string;
    labels: string[];
    onLabelClick?: (label: string) => void; // ✅ tambahkan optional callback
};

function FilterContainer({ title, labels, onLabelClick }: FilterContainerProps) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    return (
        <section className="filter-container">
            <h1>{title}</h1>
            <div className="filter-label-container">
                {labels.map((item, index) => (
                    <button
                        key={index}
                        className={activeIndex === index ? "label-detail__on" : "label-detail"}
                        onClick={() => {
                            setActiveIndex(index); // ubah tampilan aktif
                            if (onLabelClick) onLabelClick(item); // ✅ kirim label ke parent
                        }}
                    >
                        {item}
                    </button>
                ))}
            </div>
        </section>
    );
}

export default FilterContainer;