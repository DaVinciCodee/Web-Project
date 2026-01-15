import { useState } from 'react';
import { Link } from 'react-router-dom';
import './RecommendationCard.css';

const RecommendationCard = ({ user, score, details, onFollow }) => {
  const [isFollowed, setIsFollowed] = useState(false);

  const getReasonText = () => {
    if (details?.commonTracks > 0) return "Mêmes sons";
    if (details?.commonArtists > 0) return "Mêmes artistes";
    return "Même Vibe";
  };

  const handleFollowClick = (e) => {
    e.preventDefault(); 
    e.stopPropagation(); 

    if (onFollow && typeof onFollow === 'function') {
        onFollow();
        setIsFollowed(true);
    } else {
        console.error("Erreur : La fonction onFollow n'a pas été passée au composant !");
    }
  };

  return (
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
          <button 
            className="btn-follow-card" 
            onClick={handleFollowClick}
            disabled={isFollowed}
          >
            {isFollowed ? "Abonné" : "Suivre +"}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default RecommendationCard;