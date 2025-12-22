import React, { useState, useEffect } from 'react';
import { fetchUserProfile } from '../services/api';
import Chat from '../components/Chat'; 
import './Messenger.css'; 
import Suggestions from '../components/Suggestions';

const Messenger = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [listFriend, setListFriend] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  useEffect(() => {
    const spotifyId = localStorage.getItem("mySpotifyId");
    
    if (spotifyId) {
      fetchUserProfile(spotifyId)
        .then(data => {
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
    }
  }, []);

  return (
    <div className="messenger-container">
      
      {/* COLONNE GAUCHE : La liste des amis */}
      <div className="messenger-sidebar">
        <h3>Vos Messages</h3>
        <div className="friends-list">
          {listFriend.length > 0 ? (
            listFriend.map((friend, index) => {
            const friendName = typeof friend === 'string' ? friend : friend.username || "Utilisateur inconnu";
            const friendId = typeof friend === 'string' ? friend : friend._id;

            return (
              <div 
                key={index} // Idéalement utilisez friendId comme key si dispo
                className={`friend-item ${selectedFriend?._id === friendId ? 'active' : ''}`}
                onClick={() => {
                  // On passe un objet structurellement correct au composant Chat
                  setSelectedFriend({ _id: friendId, username: friendName });
                }}
              >
                <div className="friend-avatar-placeholder">👤</div>
                <span>{friendName}</span> 
              </div>
            );
          })
          ) : (
            <p>Vous ne suivez personne pour l'instant.</p>
          )}
        </div>
      </div>

      <div className="messenger-chat-window">
        {selectedFriend && currentUser ? (
          <Chat currentUser={currentUser} currentChat={selectedFriend} />
        ) : (
          <div className="no-chat-selected">
            <h2>Select a message</h2>
            <p>Choose from your existing conversations, start a new one, or just keep swimming.</p>
            <button className="new-msg-btn">New message</button>
          </div>
        )}
      </div>
      <div className="messenger-sidebar">
        <h3>Vos Messages</h3>
        <div className="friends-list">
            {/* ... votre liste d'amis ... */}
        </div>

        {/* On ajoute les suggestions en bas de la sidebar */}
        {/* {currentUser && <Suggestions currentUser={currentUser} />} */}
</div>

    </div>
  );
};

export default Messenger;