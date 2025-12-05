// src/components/RecommendationCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import './RecommendationCard.css';

const RecommendationCard = ({ user, score, details }) => {
  
  // Petite logique pour déterminer le texte à afficher
  // On le fait ici pour ne pas polluer le composant parent
  const getReasonText = () => {
    if (details?.commonTracks > 0) return "🎵 Mêmes sons";
    if (details?.commonArtists > 0) return "🎤 Mêmes artistes";
    return "🌊 Même Vibe";
  };

  return (
    <Link to={`/profile?id=${user.spotifyId}`} className="reco-card-link">
      <div className="reco-card">
        
        {/* En-tête avec Avatar + Score */}
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

        {/* Infos Utilisateur */}
        <div className="reco-info">
          <h4>{user.user_name || "Utilisateur"}</h4>
          <small>{getReasonText()}</small>
        </div>

      </div>
    </Link>
  );
};

export default RecommendationCard;