type ButtonProps = {
    nameButton: string;
    onClick?: () => void;
};

function Button({ nameButton, onClick }: ButtonProps) {
    return (
        <button className="button" onClick={onClick}>
            {nameButton}
        </button>
    );
}

export default Button;
