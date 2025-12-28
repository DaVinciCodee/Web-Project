import './ArtistCard.css';

// On récupère les infos via les "props" (arguments)
const ArtistCard = ({ name, imageUrl, genres }) => {
  
  // Petite sécurité : Si pas d'image, on met une image par défaut (gris)
   const imageSrc = imageUrl ? imageUrl : 'https://cdn-icons-png.flaticon.com/512/3844/3844724.png';

  // On prend juste le premier genre pour ne pas surcharger la carte
  const mainGenre = genres && genres.length > 0 ? genres[0] : 'Artiste';

  return (
    <div className="artist-card">
      <img src={imageSrc} alt={name} className="artist-image" />
      <h3 className="artist-name">{name}</h3>
      <p className="artist-genre">{mainGenre}</p>
    </div>
  );
};

export default ArtistCard;
