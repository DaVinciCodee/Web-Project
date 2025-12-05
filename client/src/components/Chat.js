import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import './Chat.css'; // Pour le style (voir plus bas)

const socket = io('http://localhost:8000');

export default function Chat({ currentUser, currentChat }) {
  const [messages, setMessages] = useState([]);
  const [msgInput, setMsgInput] = useState("");
  const scrollRef = useRef(); // Pour scroller auto vers le bas

  // 1. Initialisation : Dire au serveur qui je suis
  useEffect(() => {
    if (currentUser) {
      socket.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  // 2. Chargement de l'historique quand on change d'ami
  useEffect(() => {
    async function fetchHistory() {
        if(currentChat) {
            const response = await axios.post(`http://localhost:8000/api/messages/getmsg`, {
                from: currentUser._id,
                to: currentChat._id,
            });
            setMessages(response.data);
        }
    }
    fetchHistory();
  }, [currentChat]);

  // 3. Écoute des messages entrants en temps réel
  useEffect(() => {
    if (socket) {
      socket.on("msg-recieve", (data) => {
        // Sécurité : On affiche le message seulement s'il vient de la personne avec qui je parle actuellement
        if(currentChat && data.from === currentChat._id) {
             setMessages((prev) => [...prev, { fromSelf: false, message: data.msg }]);
        }
      });
    }
  }, [currentChat]);

  // 4. Envoyer un message
  const handleSendMsg = async (event) => {
    event.preventDefault();
    if (msgInput.length > 0) {
      // A. Envoi au serveur Socket (Temps réel)
      socket.emit("send-msg", {
        to: currentChat._id,
        from: currentUser._id,
        msg: msgInput,
      });

      // B. Ajout local immédiat (pour que ça soit fluide pour moi)
      const msgs = [...messages];
      msgs.push({ fromSelf: true, message: msgInput });
      setMessages(msgs);
      setMsgInput("");
    }
  };

  // 5. Scroll automatique en bas
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="chat-header">
        Conversation avec {currentChat ? currentChat.username : "..."}
      </div>

      <div className="chat-messages">
        {messages.map((message, index) => (
          <div ref={scrollRef} key={index}>
            <div className={`message ${message.fromSelf ? "sended" : "recieved"}`}>
              <div className="content">
                <p>{message.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <form className="chat-input" onSubmit={handleSendMsg}>
        <input
          type="text"
          placeholder="Tapez votre message..."
          value={msgInput}
          onChange={(e) => setMsgInput(e.target.value)}
        />
        <button type="submit">Envoyer</button>
      </form>
    </div>
  );
}