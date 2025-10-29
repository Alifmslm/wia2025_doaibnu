import { useState } from "react";

type LabelDetailProps = {
    label: string;
};

function LabelDetail({ label }: LabelDetailProps) {
    const [isActive, setIsActive] = useState(false);

    const toggleActive = () => {
        setIsActive(!isActive);
    };

    return (
        <button
            className={isActive ? "label-detail__on" : "label-detail"}
            onClick={toggleActive}
        >
            {label}
        </button>
    );
}

export default LabelDetail;
