import { useState, useRef, useEffect } from "react";
import "../../../style/QuoteLanding.css";

const testimonials = [
    {
        id: 1,
        img: "https://via.placeholder.com/320x180/E0E0E0/808080?text=UMKM+1",
        text: "Platform ini sangat membantu bisnis saya ditemukan!",
        author: "Budi Santoso",
        authorDesc: "Pemilik Kedai Kopi, Sejak 2023"
    },
    {
        id: 2,
        img: "https://via.placeholder.com/320x180/E0E0E0/808080?text=UMKM+2",
        text: "Suka banget! Jadi gampang cari makanan enak di sekitar.",
        author: "Citra Lestari",
        authorDesc: "Pecinta Kuliner, Sejak 2024"
    },
    {
        id: 3,
        img: "https://via.placeholder.com/320x180/E0E0E0/808080?text=UMKM+3",
        text: "Baru tau, banyak banget UMKM unik dan kreatif di sini.!",
        author: "Maulana Aditya",
        authorDesc: "Pengguna Setia, Sejak 2024"
    },
    {
        id: 4,
        img: "https://via.placeholder.com/320x180/E0E0E0/808080?text=UMKM+4",
        text: "Interfacenya bersih dan mudah digunakan.",
        author: "Dewi Anggraini",
        authorDesc: "Mahasiswa Desain, Sejak 2023"
    },
    {
        id: 5,
        img: "https://via.placeholder.com/320x180/E0E0E0/808080?text=UMKM+5",
        text: "Fitur 'Hidden Gem' nya juara! Selalu nemu tempat baru.",
        author: "Rian Hidayat",
        authorDesc: "Travel Blogger, Sejak 2024"
    },
    {
        id: 6,
        img: "https://via.placeholder.com/320x180/E0E0E0/808080?text=UMKM+6",
        text: "Akhirnya ada platform yang fokus ke UMKM lokal.",
        author: "Siti Aminah",
        authorDesc: "Ibu Rumah Tangga, Sejak 2023"
    }
];

const STARTING_INDEX = 2;

function QuoteLanding() {
    const [activeIndex, setActiveIndex] = useState(STARTING_INDEX);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const carouselRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!wrapperRef.current || !carouselRef.current) return;

        const wrapper = wrapperRef.current;
        const carousel = carouselRef.current;
        const activeElement = carousel.children[activeIndex] as HTMLElement;

        if (!activeElement) return;

        const itemCenter = activeElement.offsetLeft + activeElement.offsetWidth / 2;
        const wrapperCenter = wrapper.offsetWidth / 2;
        const carouselOffset = carousel.offsetLeft; 

        wrapper.scrollLeft = (carouselOffset + itemCenter) - wrapperCenter;

    }, [activeIndex]);

    const handlePrev = () => {
        setActiveIndex((prev) => (prev === 0 ? 0 : prev - 1));
    };

    const handleNext = () => {
        setActiveIndex((prev) => (prev === testimonials.length - 1 ? testimonials.length - 1 : prev + 1));
    };

    const activeTestimonial = testimonials[activeIndex];

    return (
        <>
            <section className="quote-landing">
                <div className="quote-header">
                    <h1>Ditemukan & Menemukan</h1>
                    <p>Tempat di mana UMKM dan pelanggan saling bertemu</p>
                </div>

                <div className="quote-carousel-wrapper" ref={wrapperRef}>
                    <div className="quote-carousel" ref={carouselRef}>
                        {testimonials.map((item, index) => (
                            <img
                                key={item.id}
                                src={item.img}
                                className={
                                    index === activeIndex
                                        ? "quote-carousel__item active"
                                        : "quote-carousel__item"
                                }
                                alt={`Testimonial dari ${item.author}`}
                                onClick={() => setActiveIndex(index)}
                            />
                        ))}
                    </div>
                </div>

                <div className="quote-testimonial">
                    <p className="quote-text">"{activeTestimonial.text}"</p>
                    <p className="quote-author">{activeTestimonial.author}</p>
                    <p className="quote-author-desc">{activeTestimonial.authorDesc}</p>
                </div>

                <div className="quote-buttons">
                    <button 
                        className="carousel-btn btn-prev" 
                        onClick={handlePrev}
                        disabled={activeIndex === 0}
                    >
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>
                    <button 
                        className="carousel-btn btn-next" 
                        onClick={handleNext}
                        disabled={activeIndex === testimonials.length - 1}
                    >
                        <i className="fa-solid fa-chevron-right"></i>
                    </button>
                </div>
            </section>
        </>
    )
}

export default QuoteLanding;