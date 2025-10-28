type ButtonProps = {
    nameButton: string;
}

function Button({nameButton}:ButtonProps) {
    return(
        <button>{nameButton}</button>
    )
}

export default Button