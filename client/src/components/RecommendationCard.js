import React from 'react';
import { Link } from 'react-router-dom';
import './RecommendationCard.css';

// 1. On récupère bien 'onFollow'
const RecommendationCard = ({ user, score, details, onFollow }) => {

  const getReasonText = () => {
    if (details?.commonTracks > 0) return "🎵 Mêmes sons";
    if (details?.commonArtists > 0) return "🎤 Mêmes artistes";
    return "🌊 Même Vibe";
  };

  // 2. Gestion du clic sur le bouton "Suivre"
  const handleFollowClick = (e) => {
    // EMPÊCHE d'aller sur la page de profil (comportement du Link)
    e.preventDefault(); 
    e.stopPropagation(); // Arrête la propagation pour être sûr
    
    // SÉCURITÉ : On vérifie que la fonction existe avant de l'appeler
    if (onFollow && typeof onFollow === 'function') {
        onFollow();
    } else {
        console.error("Erreur : La fonction onFollow n'a pas été passée au composant !");
    }
  };

  return (
    // Le Link entoure tout -> Clic partout = Profil
    <Link to={`/profile?id=${user.spotifyId}`} className="reco-card-link">
      <div className="reco-card">
        
        <div className="reco-header">
          <img 
            src={user.profilePicture || "https://cdn-icons-png.flaticon.com/512/847/847969.png"} 
            alt={user.user_name} 
            className="reco-avatar"
          />
          <div>
            <span className="reco-score">{score} Match</span>
          </div>
        </div>

        <div className="reco-info">
          <h4>{user.user_name || "Utilisateur"}</h4>
          <small>{getReasonText()}</small>

          {/* Clic ici = handleFollowClick (pas de redirection) */}
          <button className="btn-follow-card" onClick={handleFollowClick}>
            Suivre +
          </button>
        </div>

      </div>
    </Link>
  );
};

export default RecommendationCard;