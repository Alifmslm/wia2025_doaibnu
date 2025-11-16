// Anda mungkin perlu mendefinisikan UmkmData di sini juga jika ini file terpisah
interface UmkmData {
  id: number;
  name: string;
  category: string;
  icon: string;
  imageUrl: string;
}

interface UmkmFavoritCardProps {
    data: UmkmData;
    activeId: number; // 👈 Prop baru dari state
    onMouseEnter: () => void; // 👈 Handler untuk hover
    onMouseLeave: () => void; // 👈 Handler untuk leave
}

function UmkmFavoritCard({ data, activeId, onMouseEnter, onMouseLeave }: UmkmFavoritCardProps) {
    
    // Tentukan apakah kartu ini harus OFF.
    // Kartu OFF jika ID-nya TIDAK sama dengan ID yang sedang aktif.
    const isCurrentlyOff = data.id !== activeId;
    
    const cardStyle = {
      backgroundImage: `
        linear-gradient(180deg, #0000 0%, #2FB06D 100%),
        url('${data.imageUrl}')
      `
    };

    return (
        <div 
          className={`umkm-card ${isCurrentlyOff ? "off-card" : ""}`} // 👈 Terapkan kelas berdasarkan state
          style={cardStyle}
          onMouseEnter={onMouseEnter} // 👈 Kaitkan event
          onMouseLeave={onMouseLeave} // 👈 Kaitkan event
        >
            <div className="category-label">
                <i className={data.icon}></i>
                <p>{data.category}</p>
            </div>
            <h2 className="umkm-name">{data.name}</h2>
        </div>
    )
}

export default UmkmFavoritCard;