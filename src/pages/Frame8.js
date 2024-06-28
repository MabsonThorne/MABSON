import { useCallback, useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const Frame8 = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [showChatRecords, setShowChatRecords] = useState(false);

  useEffect(() => {
    // Fetch chat messages
    axios.get(`http://106.52.158.123:5000/api/chat/${id}`)
      .then(response => setChatMessages(response.data))
      .catch(error => console.error('Error fetching chat messages:', error));

    // Fetch user info
    axios.get(`http://106.52.158.123:5000/api/basic_profile/${id}`)
      .then(response => setUserInfo(response.data))
      .catch(error => console.error('Error fetching user info:', error));
  }, [id]);

  const handleSendMessage = () => {
    if (message.trim()) {
      // Send message to the backend (Assuming there's an API for sending messages)
      axios.post(`http://106.52.158.123:5000/api/chat/${id}`, { message })
        .then(() => {
          // Update local chat messages state
          setChatMessages([...chatMessages, { sender: 'self', text: message }]);
          setMessage("");
        })
        .catch(error => console.error('Error sending message:', error));
    }
  };

  const handleBackClick = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleSellClick = useCallback(() => {
    navigate(`/3/${id}`);
  }, [navigate, id]);

  const toggleUserInfo = () => {
    setShowUserInfo(!showUserInfo);
  };

  const toggleChatRecords = () => {
    setShowChatRecords(!showChatRecords);
  };

  return (
    <div className="frame8-container">
      <div className={`chat-records ${showChatRecords ? 'show' : ''}`}>
        <div className="header">
          <div className="back-button" onClick={toggleChatRecords}>
            {showChatRecords ? '<' : '>'}
          </div>
          <div className="title">沟通过的人</div>
          <TextField
            className="search-chats"
            placeholder="Search chats"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <img width="24px" height="24px" src="/search.svg" alt="Search" />
              ),
            }}
            sx={{
              "& fieldset": { borderColor: "#e0e0e0" },
              "& .MuiInputBase-root": {
                height: "40px",
                backgroundColor: "#fff",
                paddingLeft: "12px",
                borderRadius: "8px",
              },
              "& .MuiInputBase-input": {
                paddingLeft: "12px",
                color: "#828282",
              },
            }}
          />
        </div>
        <div className="chat-list">
          {chatMessages.map((chat, index) => (
            <div key={index} className="chat-item">
              <img className="avatar" alt="Avatar" src={chat.avatar} />
              <div className="chat-details">
                <div className="chat-name">{chat.name}</div>
                <div className="chat-message">{chat.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="chat-box">
        <div className="chat-header">
          <div className="back-button" onClick={toggleUserInfo}>
            {showUserInfo ? '<' : '>'}
          </div>
          <img className="avatar button" alt="Avatar" src={userInfo?.avatar_file} onClick={toggleUserInfo} />
          <div className="chat-info">
            <div className="chat-name">{userInfo?.username}</div>
            <div className="chat-status">Active 20m ago</div>
          </div>
        </div>
        <div className="chat-messages">
          {chatMessages.map((message, index) => (
            <div key={index} className={`chat-message ${message.sender}`}>
              <div className="message-bubble">{message.text}</div>
            </div>
          ))}
        </div>
        <div className="chat-input">
          <TextField
            className="message-input"
            placeholder="Enter your message"
            variant="outlined"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{
              "& fieldset": { borderColor: "#e0e0e0" },
              "& .MuiInputBase-root": {
                backgroundColor: "#fff",
                borderRadius: "8px",
              },
              "& .MuiInputBase-input": {
                paddingLeft: "12px",
                color: "#828282",
              },
            }}
          />
          <Button className="send-button" onClick={handleSendMessage}>发送</Button>
          <div className="icon-button"><MicIcon /></div>
          <div className="icon-button"><EmojiIcon /></div>
          <div className="icon-button"><ImageIcon /></div>
        </div>
      </div>
      <div className={`user-info ${showUserInfo ? 'show' : ''}`}>
        <img className="user-avatar" alt="User Avatar" src={userInfo?.avatar_file} />
        <div className="user-name">{userInfo?.username}</div>
        <div className="user-status">Active 20m ago</div>
        <Button
          className="sell-button"
          disableElevation
          variant="contained"
          onClick={handleSellClick}
          sx={{
            textTransform: "none",
            color: "#fff",
            fontSize: "16px",
            background: "#ff0000",
            borderRadius: "8px",
            "&:hover": { background: "#ff0000" },
            height: 40,
          }}
        >
          他卖过的
        </Button>
      </div>
      <style jsx>{`
        .frame8-container {
          display: flex;
          width: 100%;
          height: 100vh;
          background-color: #f5f5f5;
          padding: 20px;
          box-sizing: border-box;
        }

        .chat-records {
          width: 25%;
          background-color: white;
          border-right: 1px solid #e0e0e0;
          padding: 10px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          transform: translateX(-100%);
          transition: transform 0.3s ease;
        }

        .chat-records.show {
          transform: translateX(0);
        }

        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 10px;
          border-bottom: 1px solid #e0e0e0;
        }

        .back-button {
          cursor: pointer;
          font-size: 24px;
        }

        .title {
          font-size: 16px;
          font-weight: bold;
        }

        .search-chats {
          margin-left: auto;
        }

        .chat-list {
          margin-top: 10px;
          flex: 1;
          overflow-y: auto;
        }

        .chat-item {
          display: flex;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #e0e0e0;
        }

        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: 10px;
        }

        .chat-details {
          flex: 1;
        }

        .chat-name {
          font-size: 14px;
          font-weight: bold;
        }

        .chat-message {
          font-size: 12px;
          color: #828282;
        }

        .chat-box {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 10px;
          background-color: white;
          height: 100%;
        }

        .chat-header {
          display: flex;
          align-items: center;
          padding-bottom: 10px;
          border-bottom: 1px solid #e0e0e0;
        }

        .chat-info {
          margin-left: 10px;
        }

        .chat-name {
          font-size: 14px;
          font-weight: bold;
        }

        .chat-status {
          font-size: 12px;
          color: #828282;
        }

        .chat-messages {
          flex: 1;
          padding: 10px 0;
          overflow-y: auto;
        }

        .chat-message {
          margin-bottom: 10px;
        }

        .chat-message.self .message-bubble {
          background-color: #ed9898;
          color: white;
          align-self: flex-end;
        }

        .chat-message.other .message-bubble {
          background-color: #e0e0e0;
          color: black;
          align-self: flex-start;
        }

        .message-bubble {
          max-width: 70%;
          padding: 10px;
          border-radius: 15px;
          font-size: 14px;
        }

        .chat-input {
          display: flex;
          align-items: center;
          padding-top: 10px;
          border-top: 1px solid #e0e0e0;
        }

        .message-input {
          flex: 1;
          margin-right: 10px;
        }

        .send-button {
          background-color: red;
          color: white;
          border-radius: 20px;
          padding: 10px 20px;
          margin-right: 10px;
        }

        .icon-button {
          cursor: pointer;
          width: 24px;
          height: 24px;
          margin-left: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-info {
          width: 25%;
          background-color: white;
          border-left: 1px solid #e0e0e0;
          padding: 10px;
          box-sizing: border-box;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          gap: 20px;
          padding-top: 40px; /* Adding padding to position the content away from the top */
          transform: translateX(100%);
          transition: transform 0.3s ease;
        }

        .user-info.show {
          transform: translateX(0);
        }

        .user-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          margin-bottom: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        .user-name {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 5px;
        }

        .user-status {
          font-size: 12px;
          color: #828282;
        }

        .sell-button {
          width: 100%;
        }

        @media (max-width: 768px) {
          .frame8-container {
            flex-direction: column;
            height: auto;
          }

          .chat-records,
          .user-info {
            width: 100%;
            order: 1;
            height: auto;
          }

          .chat-box {
            width: 100%;
            order: 2;
            height: auto;
          }

          .chat-input {
            flex-direction: column;
          }

          .message-input {
            margin-right: 0;
            margin-bottom: 10px;
          }

          .icon-button {
            margin-left: 0;
          }
        }
      `}</style>
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .button {
          cursor: pointer;
          transition: box-shadow 0.3s ease;
        }
        .button:hover {
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        .back-button:before {
          content: '<';
          display: inline-block;
          margin-right: 5px;
        }
        .icon-button:before {
          display: inline-block;
          font-size: 24px;
          color: #000;
        }
        .icon-button:first-of-type:before {
          content: '🎤';
        }
        .icon-button:nth-of-type(2):before {
          content: '😀';
        }
        .icon-button:nth-of-type(3):before {
          content: '📷';
        }
      `}</style>
    </div>
  );
};

export default Frame8;
