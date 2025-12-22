import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import './Chat.css';

// Initialisation du socket
const socket = io('http://localhost:8000');

export default function Chat({ currentUser, currentChat }) {
  const [messages, setMessages] = useState([]);
  const [msgInput, setMsgInput] = useState("");
  const scrollRef = useRef();

  // 1. Connexion / Identification
  useEffect(() => {
    if (currentUser) {
      socket.emit("register", currentUser._id);
    }
  }, [currentUser]);

  // 2. Chargement de l'historique
  useEffect(() => {
    async function fetchHistory() {
        if(currentChat) {
            try {
                const response = await axios.post(`http://localhost:8000/api/messages/getmsg`, {
                    from: currentUser._id,
                    to: currentChat._id,
                });
                setMessages(response.data);
            } catch (err) {
                console.error("Erreur chargement historique:", err);
            }
        }
    }
    fetchHistory();
  }, [currentChat, currentUser]);

  // 3. Écoute des messages (Temps Réel)
  useEffect(() => {
    if (socket) {
      const handleMessage = (data) => {
        // CORRECTION 1 : On vérifie si le message vient de l'ami actif
        const isFromCurrentChat = data.sender === currentChat._id;
        
        // CORRECTION 2 : On N'AJOUTE PAS le message s'il vient de MOI 
        // (car on l'ajoute déjà instantanément dans handleSendMsg pour la fluidité)
        if (isFromCurrentChat) {
           setMessages((prev) => [...prev, { 
               fromSelf: false, 
               message: data.content 
           }]);
        }
      };

      socket.on("private message", handleMessage);

      return () => {
          socket.off("private message", handleMessage);
      };
    }
  }, [currentChat, currentUser]);

  // 4. Envoi du message
  const handleSendMsg = async (event) => {
    event.preventDefault();
    if (msgInput.length > 0) {
      
      const msgData = {
        to: currentChat._id,
        from: currentUser._id,
        content: msgInput, 
      };

      // Envoi au serveur
      socket.emit("private message", msgData);

      // Ajout local immédiat (Optimistic UI)
      const msgs = [...messages];
      msgs.push({ fromSelf: true, message: msgInput });
      setMessages(msgs);
      
      setMsgInput("");
    }
  };

  // Scroll automatique
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Gestion sécurisée du nom d'affichage
  const chatName = currentChat 
    ? (currentChat.user_name || currentChat.username || "Utilisateur") 
    : "Sélectionnez un ami";

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="user-details">
            <div className="avatar">👤</div>
            <div className="username">
                <h3>{chatName}</h3>
            </div>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((message, index) => (
          <div ref={scrollRef} key={index}>
            <div className={`message ${message.fromSelf ? "sended" : "recieved"}`}>
              <div className="content">
                <p>{message.message || message.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <form className="chat-input-container" onSubmit={handleSendMsg}>
        <input
          type="text"
          placeholder="Tapez votre message..."
          value={msgInput}
          onChange={(e) => setMsgInput(e.target.value)}
        />
        <button type="submit">Envoyer ✈️</button>
      </form>
    </div>
  );
}