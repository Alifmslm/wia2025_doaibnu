type IconCircularProps = {
    src: string;        // URL atau path gambar
    alt?: string;       // alt text opsional
};


function IconCircular({src, alt}: IconCircularProps) {
    return(
        <>
            <div className="icon-item">
                <img src={src} alt={alt} />
            </div>
        </>
    )
}

export default IconCircular;