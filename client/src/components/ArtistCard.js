import React from 'react';
import './ArtistCard.css';

const ArtistCard = ({ name, imageUrl, genres }) => {
  
   const imageSrc = imageUrl ? imageUrl : 'https://cdn-icons-png.flaticon.com/512/3844/3844724.png';

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