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

        <div className="show-more">Voir plus</div>
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