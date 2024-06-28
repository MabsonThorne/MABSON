import { useCallback, useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import FrameComponent4 from "../components/FrameComponent4";

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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
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
    <div className="relative flex flex-col h-screen w-full bg-gray-100">
      <FrameComponent4 />
      <div className="flex-1 flex p-5 box-border border-t border-gray-300">
        <div className={`transition-transform duration-300 ${showChatRecords ? 'w-1/4 border-r border-gray-300' : 'w-0 overflow-hidden'}`}>
          <div className="flex items-center justify-between p-4 border-b border-gray-300">
            <div className="cursor-pointer text-xl bg-gray-200 rounded-full p-2" onClick={handleBackClick}>
              {'<'}
            </div>
            <div className="text-lg font-bold">沟通过的人</div>
          </div>
          <div className="p-4 border-b border-gray-300">
            <TextField
              className="w-full"
              placeholder="Search chats"
              variant="outlined"
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
          <div className="overflow-y-auto p-4">
            {chatMessages.map((chat, index) => (
              <div key={index} className="flex items-center p-2 border-b border-gray-200">
                <img className="w-10 h-10 rounded-full mr-4" alt="Avatar" src={chat.avatar} />
                <div className="flex flex-col">
                  <div className="font-bold">{chat.name}</div>
                  <div className="text-sm text-gray-500">{chat.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={`flex-1 flex flex-col bg-white transition-transform duration-300 ${showChatRecords ? 'ml-1/4' : ''}`}>
          <div className="flex items-center justify-between p-4 border-b border-gray-300">
            <div className="cursor-pointer text-xl" onClick={toggleChatRecords}>
              {showChatRecords ? '<' : '>'}
            </div>
            <div className="flex items-center">
              <img className="w-10 h-10 rounded-full cursor-pointer shadow-md" alt="Avatar" src={userInfo?.avatar_file} onClick={toggleUserInfo} />
              <div className="ml-4">
                <div className="font-bold">{userInfo?.username}</div>
                <div className="text-sm text-gray-500">Active 20m ago</div>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {chatMessages.map((message, index) => (
              <div key={index} className={`flex ${message.sender === 'self' ? 'justify-end' : 'justify-start'} mb-4`}>
                <div className={`p-4 rounded-lg ${message.sender === 'self' ? 'bg-red-200 text-white' : 'bg-gray-200 text-black'}`}>
                  {message.text}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center p-4 border-t border-gray-300">
            <TextField
              className="flex-1"
              placeholder="Enter your message"
              variant="outlined"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
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
            <Button
              className="ml-2 bg-red-500 text-white rounded-full p-2"
              onClick={handleSendMessage}
              sx={{ textTransform: 'none', backgroundColor: '#ff0000', '&:hover': { backgroundColor: '#ff0000' } }}
            >
              发送
            </Button>
            <div className="icon-button ml-2 mic-icon"></div>
            <div className="icon-button ml-2 emoji-icon"></div>
            <div className="icon-button ml-2 image-icon"></div>
          </div>
        </div>
        <div className={`fixed top-0 right-0 h-full transition-transform duration-300 transform ${showUserInfo ? 'translate-x-0' : 'translate-x-full'} bg-white border-l border-gray-300 shadow-lg p-4 w-1/3`}>
          <div className="flex flex-col items-center">
            <img className="w-20 h-20 rounded-full mb-4 shadow-md" alt="User Avatar" src={userInfo?.avatar_file} />
            <div className="text-lg font-bold mb-2">{userInfo?.username}</div>
            <div className="text-sm text-gray-500 mb-4">Active 20m ago</div>
            <Button
              className="w-full bg-red-500 text-white rounded-full"
              disableElevation
              variant="contained"
              onClick={handleSellClick}
              sx={{ textTransform: 'none', backgroundColor: '#ff0000', '&:hover': { backgroundColor: '#ff0000' } }}
            >
              他卖过的
            </Button>
          </div>
        </div>
      </div>
      <style jsx>{`
        .icon-button {
          cursor: pointer;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #000;
          border-radius: 50%;
        }

        .icon-button.mic-icon::before {
          content: '🎤';
        }

        .icon-button.emoji-icon::before {
          content: '😀';
        }

        .icon-button.image-icon::before {
          content: '📷';
        }

        .fixed-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 10;
        }

        .shadow-lg {
          box-shadow: -5px 0 15px rgba(0, 0, 0, 0.5);
        }
      `}</style>
      {showUserInfo && <div className="fixed-overlay" onClick={toggleUserInfo}></div>}
    </div>
  );
};

export default Frame8;
