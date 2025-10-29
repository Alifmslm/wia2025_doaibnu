import '../../../style/LocationTab.css'

function LocationTabs() {
    return(
        <>
            <section className="location-tab">
                <h1>Lokasi</h1>
                <iframe
                    className='embed-gmaps'
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d8148.424799200996!2d107.61754315008173!3d-6.887510983728445!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e6e33227d863%3A0x1bdb90c18f112062!2sMcDonald&#39;s%20-%20Simpang%20Dago!5e0!3m2!1sid!2sid!4v1761740393081!5m2!1sid!2sid"
                    width="600"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Google Maps - McDonald's Simpang Dago"
                ></iframe>
                <p>Jl. Rancakendal No.7, Ciburial, Kec. Cibeunying Kaler, Kabupaten Bandung, Jawa Barat</p>
            </section>
        </>
    )
}

export default LocationTabs