import { useState } from "react";
import RatingCard from "../micro-components/RatingCard";
import Pagination from "@mui/material/Pagination";
import "../../../style/RatingList.css";

function RatingList() {
    // Dummy data ulasan
    const ratings = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        score: (Math.random() * 5).toFixed(1),
        desc: "Lorem ipsum dolor sit amet consectetur. Nunc nunc phasellus elit sed non.",
        time: `${i + 1} hari yang lalu`,
    }));

    const [page, setPage] = useState(1);
    const itemsPerPage = 4;

    // Hitung total halaman
    const pageCount = Math.ceil(ratings.length / itemsPerPage);

    // Potong data sesuai halaman
    const startIndex = (page - 1) * itemsPerPage;
    const currentItems = ratings.slice(startIndex, startIndex + itemsPerPage);

    // Handle perubahan halaman
    const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    return (
        <section className="rating-list-container">
            <h1>Ulasan</h1>

            <section className="rating-list">
                {currentItems.map((item) => (
                    <RatingCard
                        key={item.id}
                        name={item.name}
                        score={item.score}
                        desc={item.desc}
                        time={item.time}
                    />
                ))}
            </section>

            <div className="pagination-container">
                <Pagination
                    count={pageCount}
                    page={page}
                    onChange={handleChange}
                    color="primary"
                    size="small"
                    shape="rounded"
                />
            </div>
        </section>
    );
}

export default RatingList;