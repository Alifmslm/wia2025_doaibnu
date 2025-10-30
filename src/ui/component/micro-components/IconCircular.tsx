type IconCircularProps = {
    src: string;        // URL atau path gambar
    alt?: string;       // alt text opsional
    url: string;       // alt text opsional
};


function IconCircular({src, alt, url}: IconCircularProps) {
    return(
        <>
            <div className="icon-item">
                <a href={url}>
                    <img src={src} alt={alt} />
                </a>
            </div>
        </>
    )
}

export default IconCircular;