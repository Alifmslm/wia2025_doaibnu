import SearchIcon from '../../../assets/search-icon.png'

function Search() {
    return (
        <>
            <section className="search-section">
                <div className="search-bar">
                    <img src={SearchIcon} alt="" className="search-icon" />
                    <input type="text" placeholder="Temukan UMKM favoritmu..." />
                </div>
            </section>
        </>
    );
}

export default Search;
