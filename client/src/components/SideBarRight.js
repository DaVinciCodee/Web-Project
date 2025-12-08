import React, { useState } from 'react';
import { FiSearch } from "react-icons/fi";
import './SideBarRight.css';

const RightSidebar = () => {
  // Données fictives pour l'UI (en attendant le Backend)
  const suggestions = [
    { id: 1, name: "The Weeknd", handle: "@abeltesfaye", avatar: "https://i.scdn.co/image/ab6761610000e5eb214f3cf1cbe7139c1f265f4e" },
    { id: 2, name: "Dua Lipa", handle: "@dualipa", avatar: "https://i.scdn.co/image/ab6761610000e5eb4c6c9d721113b284898555e3" },
    { id: 3, name: "Angèle", handle: "@angele_vl", avatar: "https://i.scdn.co/image/ab6761610000e5eb3196c92d53b9277f09230534" },
  ];

  return (
    <div className="right-section">
      
      {/* 1. BARRE DE RECHERCHE */}
      <div className="search-bar-container">
        <div className="search-icon">
            <FiSearch size={19} color="#71767B" />
        </div>
        <input 
            type="text" 
            placeholder="Chercher sur Spotimate" 
            className="search-input"
        />
      </div>

      {/* 2. SUGGESTIONS D'AMIS */}
      <div className="suggestions-container">
        <h3>Suggestions pour vous</h3>
        
        {suggestions.map((user) => (
          <SuggestionItem key={user.id} user={user} />
        ))}

        <div className="show-more">Voir plus</div>import React, { useState, useEffect } from 'react';
import { fetchSuggestions, followUser } from '../services/api';
import './SideBarRight.css'; // On s'occupera du style juste après

const SideBarRight = () => {
  const [suggestions, setSuggestions] = useState([]);
  // On récupère l'ID qu'on a stocké (notre "faux" login pour l'instant)
  const currentUserId = localStorage.getItem("mySpotifyId");

  useEffect(() => {
    if (currentUserId) {
      fetchSuggestions(currentUserId).then(data => {
        setSuggestions(data);
      });
    }
  }, [currentUserId]);

  const handleFollow = async (idToFollow) => {
    // 1. Appel API pour suivre
    const success = await followUser(idToFollow, currentUserId);
    
    if (success) {
      // 2. Si ça marche, on retire la personne de la liste visuellement
      setSuggestions(suggestions.filter(user => user._id !== idToFollow));
      
      // Optionnel : Tu pourrais aussi déclencher un rechargement de la liste d'amis à gauche
      // mais pour l'instant, un simple rechargement de page suffira pour voir le changement.
      alert("Utilisateur suivi ! Rafraîchis la page pour le voir à gauche.");
    }
  };

  if (!currentUserId) return null; // Ne rien afficher si pas connecté

  return (
    <div className="sidebar-right-container">
      <h3>Suggestions pour vous</h3>
      <div className="suggestions-list">
        {suggestions.length > 0 ? (
          suggestions.map(user => (
            <div key={user._id} className="suggestion-item">
              <div className="suggestion-info">
                <div className="avatar-placeholder">👤</div>
                <span className="username">{user.username}</span>
              </div>
              <button 
                className="follow-btn"
                onClick={() => handleFollow(user._id)}
              >
                Suivre
              </button>
            </div>
          ))
        ) : (
          <p className="no-suggestions">Aucune suggestion pour le moment.</p>
        )}
      </div>
    </div>
  );
};

export default SideBarRight;
      </div>

    </div>
  );
};

// Petit sous-composant pour gérer le bouton "Suivre" individuellement
const SuggestionItem = ({ user }) => {
    const [isFollowing, setIsFollowing] = useState(false);

    return (
        <div className="suggestion-item">
            <img src={user.avatar} alt={user.name} className="suggestion-avatar" />
            
            <div className="suggestion-info">
                <span className="suggestion-name">{user.name}</span>
                <span className="suggestion-handle">{user.handle}</span>
            </div>

            <button 
                className={`follow-btn ${isFollowing ? 'following' : ''}`}
                onClick={() => setIsFollowing(!isFollowing)}
            >
                {isFollowing ? 'Suivi' : 'Suivre'}
            </button>
        </div>
    );
}

export default RightSidebar;