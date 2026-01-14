import React, { useState, useEffect } from 'react';
import { fetchUserProfile } from '../../services/api'; 
import Chat from '../../components/Chat/Chat'; 
import './Messenger.css'; 

const Messenger = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [listFriend, setListFriend] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);

  // Load user profile and friends on component mount
  useEffect(() => {
    const spotifyId = localStorage.getItem("spotifyId");
    
    if (spotifyId) {
      fetchUserProfile(spotifyId)
        .then(data => {
          console.log("Données utilisateur chargées :", data);
          console.log("Following :", data.following);
          setCurrentUser(data);          
          if (data.following && data.following.length > 0) {
              setListFriend(data.following);
          } else {
              setListFriend([]); 
          }
        })
        .catch(error => {
          console.error("Erreur API :", error);
        });
    } else {
      console.error("Aucun Spotify ID trouvé dans le localStorage.");
    }
  }, []);

  return (
    <div className="messenger-container">
      <div className="messenger-sidebar">
        <div className="sidebar-header">
            <h3>Vos Messages</h3>
        </div>
        
        <div className="friends-list">
          {listFriend.length > 0 ? (
            listFriend.map((friend) => (
              <div 
                key={friend._id} 
                className={`friend-item ${currentChat?._id === friend._id ? 'active' : ''}`}
                onClick={() => setCurrentChat(friend)}
              >
                <div className="friend-avatar">
                {friend.profilePicture ? (
                    <img src={friend.profilePicture} alt="avatar" />
                ) : "👤"}
              </div>
                
                <span className="friend-name">
                    {friend.user_name || friend.username || "Utilisateur"}
                </span> 
              </div>
            ))
          ) : (
            <p className="no-friends-msg">Vous ne suivez personne pour l'instant.</p>
          )}
        </div>
      </div>

      <div className="messenger-chat-window">
        {currentChat && currentUser ? (
          <Chat currentUser={currentUser} currentChat={currentChat} />
        ) : (
          <div className="no-chat-selected">
            <h2>Messagerie SpotiMate 🎵</h2>
            <p>Sélectionnez un ami à gauche pour lancer la conversation.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Messenger;