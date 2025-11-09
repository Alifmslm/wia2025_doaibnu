import { useState } from "react";
import "../../../style/ReviewTabs.css";
import RatingResume from "./RatingResume";
import RatingList from "./RatingList";
import FormRating from "../micro-components/FormRating";

function ReviewTabs() {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <RatingResume onOpen={handleOpen} />

            <hr />
            <RatingList />

            <FormRating open={open} onClose={handleClose} />
        </>
    );
}

export default ReviewTabs;