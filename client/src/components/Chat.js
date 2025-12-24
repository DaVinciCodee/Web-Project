import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import './Chat.css';
import LinkPreview from './LinkPreview';

const socket = io('http://localhost:8000');

export default function Chat({ currentUser, currentChat }) {
  const [messages, setMessages] = useState([]);
  const [msgInput, setMsgInput] = useState("");
  const scrollRef = useRef();

  useEffect(() => {
    if (currentUser) {
      socket.emit("register", currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    async function fetchHistory() {
      if (currentChat) {
        try {
          const response = await axios.post(`http://localhost:8000/api/messages/getmsg`, {
            from: currentUser._id,
            to: currentChat._id,
          });
          setMessages(response.data);
        } catch (err) {
          console.error(err);
        }
      }
    }
    fetchHistory();
  }, [currentChat, currentUser]);

  useEffect(() => {
    if (socket) {
      const handleMessage = (data) => {
        const isFromCurrentChat = data.sender === currentChat._id;

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

  const handleSendMsg = async (event) => {
    event.preventDefault();
    if (msgInput.length > 0) {

      try {
        await axios.post("http://localhost:8000/api/messages/addmsg", {
          from: currentUser._id,
          to: currentChat._id,
          message: msgInput,
        });
      } catch (err) {
        console.error(err);
      }

      const msgData = {
        to: currentChat._id,
        from: currentUser._id,
        content: msgInput,
      };
      socket.emit("private message", msgData);

      const msgs = [...messages];
      msgs.push({ fromSelf: true, message: msgInput });
      setMessages(msgs);

      setMsgInput("");
    }
  };

  const extractUrl = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const match = text.match(urlRegex);
    return match ? match[0] : null;
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const chatName = currentChat
    ? (currentChat.user_name || currentChat.username || "Utilisateur")
    : "Sélectionnez un ami";

  return (
    <div className="chat-container">

      <div className="chat-header">
        <div className="header-avatar">
          {currentChat?.profilePicture ? (
            <img src={currentChat.profilePicture} alt="avatar" />
          ) : "👤"}
        </div>
        <div className="header-username">
          <h3>{chatName}</h3>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((message, index) => (
          <div ref={scrollRef} key={index}>
            <div className={`message ${message.fromSelf ? "sended" : "recieved"}`}>
              <div className="content">
                {(() => {
                  const content = message.message || message.content;
                  const urlFound = extractUrl(content);
                  const isOnlyUrl = urlFound && content.trim() === urlFound;

                  return (
                    <>
                      {!isOnlyUrl && (
                        <p>
                          {content.split(' ').map((word, i) => {
                            if (word.match(/(https?:\/\/[^\s]+)/g)) {
                              return <a key={i} href={word} target="_blank" rel="noreferrer" style={{ color: '#1db954' }}>{word} </a>;
                            }
                            return word + ' ';
                          })}
                        </p>
                      )}
                      {urlFound && (
                        <div style={isOnlyUrl ? { marginTop: '-5px' } : {}}>
                          <LinkPreview url={urlFound} />
                        </div>
                      )}
                    </>
                  );
                })()}
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
        <button type="submit">
          Envoyer
        </button>
      </form>
    </div>
  );
}