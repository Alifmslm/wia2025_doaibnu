type ButtonProps = {
    nameButton: string;
    cekLogin: boolean;
    onClick?: () => void;
};

function Button({ nameButton, onClick }: ButtonProps) {

    return (
        <button className="button" type="submit" onClick={onClick}>
            {nameButton}
        </button>
    );
}

export default Button;
