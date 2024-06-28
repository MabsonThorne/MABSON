import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import PropTypes from "prop-types";
import ProductCard from "./ProductCard";
import UserCard from "./UserCard";

const Frame8 = ({ className = "" }) => {
  const { id: currentUserId } = useParams();
  const navigate = useNavigate();
  const [userProfiles, setUserProfiles] = useState([]);
  const [currentChatUser, setCurrentChatUser] = useState(null);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfiles = async () => {
      try {
        const response = await axios.get("http://106.52.158.123:5000/api/conversations", { withCredentials: true });
        setUserProfiles(response.data);
        setError(null);  // Clear previous errors
      } catch (error) {
        setError("Error fetching user profiles");
        console.error("Error fetching user profiles:", error);
      }
    };

    const fetchCurrentUserData = async () => {
      try {
        const response = await axios.get(`http://106.52.158.123:5000/api/basic_profile/${currentUserId}`, { withCredentials: true });
        setCurrentUserData(response.data);
        setError(null);  // Clear previous errors
      } catch (error) {
        setError("Error fetching current user data");
        console.error("Error fetching current user data:", error);
      }
    };

    fetchUserProfiles();
    fetchCurrentUserData();
    setLoading(false);
  }, [currentUserId]);

  const handleChatUserClick = async (userId) => {
    try {
      const response = await axios.get(`http://106.52.158.123:5000/api/basic_profile/${userId}`, { withCredentials: true });
      setCurrentChatUser(response.data);
      setError(null);  // Clear previous errors
    } catch (error) {
      setError("Error fetching chat user data");
      console.error("Error fetching chat user data:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await axios.post(
        `http://106.52.158.123:5000/api/messages`,
        {
          senderId: currentUserId,
          receiverId: currentChatUser.id,
          content: newMessage,
        },
        { withCredentials: true }
      );

      setMessages([...messages, response.data]);
      setNewMessage("");
      setError(null);  // Clear previous errors
    } catch (error) {
      setError("Error sending message");
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className={`frame8-container ${className}`}>
      <header className="frame-header">
        <h1>Chat</h1>
        <ProductCard />
        <UserCard />
      </header>
      <div className="main-content">
        <div className="sidebar">
          <input type="text" placeholder="Search chats" className="search-input" />
          {userProfiles.map((user) => (
            <button
              key={user.id}
              className={`user-card ${currentChatUser && currentChatUser.id === user.id ? "active" : ""}`}
              onClick={() => handleChatUserClick(user.id)}
            >
              <img src={user.avatar_file} alt={user.username} className="user-avatar" />
              <div className="user-info">
                <div className="user-name">{user.username}</div>
                <div className="user-last-message">{user.lastMessage}</div>
              </div>
            </button>
          ))}
        </div>
        <div className="chat-area">
          {currentChatUser ? (
            <div className="chat-header">
              <img src={currentChatUser.avatar_file} alt={currentChatUser.username} className="chat-user-avatar" />
              <div className="chat-user-info">
                <div className="chat-user-name">{currentChatUser.username}</div>
                <div className="chat-user-status">{currentChatUser.lastActive}</div>
              </div>
            </div>
          ) : (
            <div className="chat-placeholder">Select a user to start chatting</div>
          )}
          <div className="chat-messages">
            {messages.map((message) => (
              <div key={message.id} className={`chat-message ${message.senderId === currentUserId ? "outgoing" : "incoming"}`}>
                <div className="message-content">{message.content}</div>
              </div>
            ))}
          </div>
          {currentChatUser && (
            <div className="chat-input-area">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message"
                className="chat-input"
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button onClick={handleSendMessage} className="send-button">Send</button>
            </div>
          )}
        </div>
        <div className={`user-info-sidebar ${currentChatUser ? "visible" : ""}`}>
          {currentChatUser && (
            <>
              <img src={currentChatUser.avatar_file} alt={currentChatUser.username} className="user-avatar" />
              <div className="user-info">
                <div className="user-name">{currentChatUser.username}</div>
                <div className="user-gender">{currentChatUser.gender}</div>
                <div className="user-last-active">{currentChatUser.lastActive}</div>
                <button className="shadow-button" onClick={() => navigate(`/3/${currentChatUser.id}`)}>
                  他{currentChatUser.gender === "♂" ? "卖过的" : "卖过的"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <style jsx>{`
        .frame8-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
        }
        .frame-header {
          background: #f5f5f5;
          padding: 10px;
          border-bottom: 1px solid #e0e0e0;
        }
        .main-content {
          display: flex;
          flex: 1;
          overflow: hidden;
        }
        .sidebar {
          width: 300px;
          border-right: 1px solid #e0e0e0;
          padding: 10px;
          overflow-y: auto;
        }
        .search-input {
          width: 100%;
          padding: 10px;
          margin-bottom: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .user-card {
          display: flex;
          align-items: center;
          padding: 10px;
          margin-bottom: 10px;
          border-radius: 4px;
          background: #fff;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          transition: background 0.3s;
        }
        .user-card.active {
          background: #f0f0f0;
        }
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: 10px;
        }
        .user-info {
          flex: 1;
        }
        .user-name {
          font-weight: bold;
          margin-bottom: 5px;
        }
        .user-last-message {
          color: #666;
        }
        .chat-area {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .chat-header {
          display: flex;
          align-items: center;
          padding: 10px;
          border-bottom: 1px solid #e0e0e0;
          background: #fff;
        }
        .chat-user-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          margin-right: 10px;
        }
        .chat-user-info {
          flex: 1;
        }
        .chat-user-name {
          font-size: 20px;
          font-weight: bold;
        }
        .chat-user-status {
          color: #666;
        }
        .chat-messages {
          flex: 1;
          padding: 10px;
          overflow-y: auto;
        }
        .chat-message {
          margin-bottom: 10px;
          max-width: 60%;
        }
        .chat-message.outgoing {
          align-self: flex-end;
          background: #dcf8c6;
          padding: 10px;
          border-radius: 10px;
          margin-right: 10px;
        }
        .chat-message.incoming {
          align-self: flex-start;
          background: #fff;
          padding: 10px;
          border-radius: 10px;
          margin-left: 10px;
        }
        .chat-input-area {
          display: flex;
          padding: 10px;
          border-top: 1px solid #e0e0e0;
          background: #fff;
        }
        .chat-input {
          flex: 1;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          margin-right: 10px;
        }
        .send-button {
          padding: 10px 20px;
          border: none;
          background: #007bff;
          color: #fff;
          border-radius: 4px;
          cursor: pointer;
        }
        .user-info-sidebar {
          width: 300px;
          border-left: 1px solid #e0e0e0;
          padding: 10px;
          background: #fff;
          transition: transform 0.3s;
          transform: translateX(100%);
        }
        .user-info-sidebar.visible {
          transform: translateX(0);
        }
        .user-info-sidebar .user-avatar {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          margin-bottom: 10px;
        }
        .user-info-sidebar .user-info {
          text-align: center;
        }
        .shadow-button {
          background: red;
          color: #fff;
          padding: 10px;
          border-radius: 5px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

Frame8.propTypes = {
  className: PropTypes.string,
};

export default Frame8;
