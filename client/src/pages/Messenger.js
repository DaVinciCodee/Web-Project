import React, { useState, useEffect } from 'react';
import { fetchUserProfile } from '../services/api'; // Ton service API
import Chat from '../components/Chat'; // On réutilise ton composant Chat existant
import './Messenger.css'; // N'oublie pas de créer ce fichier CSS pour la mise en page

const Messenger = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [listFriend, setListFriend] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);

  useEffect(() => {
    const spotifyId = localStorage.getItem("mySpotifyId");
    
    if (spotifyId) {
      fetchUserProfile(spotifyId).then(data => {
        setCurrentUser(data);
        setListFriend(data.following || []);
        setListFriend(data.following && data.following.length > 0 ? data.following : ["Elon Musk", "Daft Punk", "Mon Voisin Totoro"]); 
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
             listFriend.map((friendId, index) => (
              <div 
                key={index}
                className={`friend-item ${selectedFriend?._id === friendId ? 'active' : ''}`}
                onClick={() => {
                    setSelectedFriend({ _id: friendId, username: friendId });
                }}
              >
                <div className="friend-avatar-placeholder">👤</div>
                <span>{friendId}</span>
              </div>
            ))
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

    </div>
  );
};

export default Messenger;