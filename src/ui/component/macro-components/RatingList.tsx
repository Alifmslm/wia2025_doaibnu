// RatingList.tsx

import { useState } from "react";
import RatingCard from "../micro-components/RatingCard";
import Pagination from "@mui/material/Pagination";
import "../../../style/RatingList.css";

// 1. Ekspor tipe data agar 'ReviewTabs' bisa menggunakannya
export interface RatingItem {
    id: number;
    name: string;
    score: string;
    desc: string;
    time: string;
}

// 2. Tentukan props yang diterima, termasuk 'ratings'
interface RatingListProps {
    ratings: RatingItem[];
}

function RatingList({ ratings }: RatingListProps) { // <-- 3. Terima 'ratings' dari props
    // HAPUS DATA HARDCODED INI DARI SINI
    // const ratings = Array.from({ length: 10 }, (_, i) => ({ ... }));

    const [page, setPage] = useState(1);
    const itemsPerPage = 4;

    // Logika paginasi sekarang menggunakan 'ratings' dari props
    const pageCount = Math.ceil(ratings.length / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const currentItems = ratings.slice(startIndex, startIndex + itemsPerPage);

    const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    // ... (sisa JSX tetap sama) ...
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