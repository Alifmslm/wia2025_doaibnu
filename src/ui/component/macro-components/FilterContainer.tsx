import { useState } from "react";

type FilterContainerProps = {
    title: string;
    labels: string[];
};

function FilterContainer({ title, labels }: FilterContainerProps) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    return (
        <section className="filter-container">
            <h1>{title}</h1>
            <div className="filter-label-container">
                {labels.map((item, index) => (
                    <button
                        key={index}
                        className={
                            activeIndex === index ? "label-detail__on" : "label-detail"
                        }
                        onClick={() => setActiveIndex(index)}
                    >
                        {item}
                    </button>
                ))}
            </div>
        </section>
    );
}

export default FilterContainer;
