import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { TextField, Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import FrameComponent4 from "../components/FrameComponent4";

const Frame8 = () => {
  const navigate = useNavigate();
  const { id: targetUserId } = useParams(); // 获取 URL 中的目标用户 ID
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      const token = Cookies.get("authToken");
      console.log(`Fetching contacts with token: ${token}`);
      try {
        const response = await axios.get("http://106.52.158.123:5000/api/contacts", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log(`Fetched contacts:`, response.data);
        setContacts(response.data);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    const fetchUserInfo = async () => {
      if (!targetUserId) {
        console.error("No targetUserId provided");
        return;
      }
      const token = Cookies.get("authToken");
      console.log(`Fetching user info for user ID: ${targetUserId} with token: ${token}`);
      try {
        const response = await axios.get(`http://106.52.158.123:5000/api/basic_profile/${targetUserId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log("Fetched user info:", response.data);
        setUserInfo(response.data);

        // Add contact to the database if not exists
        await axios.post(`http://106.52.158.123:5000/api/contacts`, {
          contact_id: targetUserId,
          last_message: "",
          last_message_time: new Date().toISOString()
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        fetchContacts(); // Refresh contacts after adding new contact
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    const fetchCurrentUser = async () => {
      const token = Cookies.get("authToken");
      console.log(`Fetching current user with token: ${token}`);
      try {
        const response = await axios.get("http://106.52.158.123:5000/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log("Fetched current user info:", response.data);
        setCurrentUserId(response.data.id);
      } catch (error) {
        console.error("Error fetching current user info:", error);
      }
    };

    fetchContacts();
    fetchUserInfo(); // 调用 fetchUserInfo 确保获取到目标用户的信息
    fetchCurrentUser();
  }, [targetUserId]); // 确保目标用户 ID 变化时重新获取信息

  const handleSendMessage = () => {
    const token = Cookies.get("authToken");
    if (message.trim()) {
      axios.post(`http://106.52.158.123:5000/api/chat/${targetUserId}`, { message }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        setChatMessages([...chatMessages, { sender_id: "self", message }]);
        setMessage("");
      })
      .catch(error => console.error("Error sending message:", error));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleSellClick = () => {
    navigate(`/3/${targetUserId}`);
  };

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    setChatMessages([]); // Reset chat messages
    // Fetch chat messages for the selected contact
    const token = Cookies.get("authToken");
    axios.get(`http://106.52.158.123:5000/api/chat/${contact.contact_id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      setChatMessages(response.data);
    })
    .catch(error => console.error("Error fetching chat messages:", error));
  };

  const handleDeleteContact = async (contactId) => {
    const token = Cookies.get("authToken");
    try {
      await axios.delete(`http://106.52.158.123:5000/api/contacts/${contactId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setContacts(contacts.filter(contact => contact.contact_id !== contactId));
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  return (
    <div className="relative flex flex-col h-screen w-full bg-gray-100">
      <FrameComponent4 />
      <div className="flex-1 flex p-5 box-border border-t border-gray-300">
        <div className="transition-transform duration-300 w-1/4 border-r border-gray-300">
          <div className="flex items-center justify-between p-4 border-b border-gray-300">
            <div className="cursor-pointer text-xl bg-gray-200 rounded-full p-2" onClick={handleBackClick}>
              {"<"}
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
                  borderRadius: "8px"
                },
                "& .MuiInputBase-input": {
                  paddingLeft: "12px",
                  color: "#828282"
                }
              }}
            />
          </div>
          <div className="overflow-y-auto p-4">
            {contacts.map((contact, index) => (
              <div key={index} className="flex items-center p-2 border-b border-gray-200 relative">
                <img className="w-10 h-10 rounded-full mr-4" alt="Avatar" src={contact.avatar_file} />
                <div className="flex flex-col">
                  <div className="font-bold">{contact.username}</div>
                  <div className="text-sm text-gray-500">{contact.last_message}</div>
                </div>
                <button
                  className="absolute right-0 p-2 text-red-500"
                  onClick={() => handleDeleteContact(contact.contact_id)}
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className={`flex-1 flex flex-col bg-white transition-transform duration-300 ${selectedContact ? "ml-1/4" : ""}`}>
          <div className="flex items-center justify-between p-4 border-b border-gray-300">
            <div className="cursor-pointer text-xl">
              {selectedContact ? "<" : ">"}
            </div>
            {selectedContact && (
              <div className="flex items-center">
                <img className="w-10 h-10 rounded-full cursor-pointer shadow-md" alt="Avatar" src={selectedContact.avatar_file} />
                <div className="ml-4">
                  <div className="font-bold">{selectedContact.username}</div>
                  <div className="text-sm text-gray-500">Active 20m ago</div>
                </div>
              </div>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {chatMessages.map((message, index) => (
              <div key={index} className={`flex ${message.sender_id === currentUserId ? "justify-end" : "justify-start"} mb-4`}>
                <div className={`p-4 rounded-lg ${message.sender_id === currentUserId ? "bg-red-200 text-white" : "bg-gray-200 text-black"}`}>
                  {message.message}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center p-4 border-t border-gray-300">
            <TextField
              className="flex-1"
              placeholder="输入消息"
              variant="outlined"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              sx={{
                "& fieldset": { borderColor: "#e0e0e0" },
                "& .MuiInputBase-root": {
                  height: "40px",
                  backgroundColor: "#fff",
                  paddingLeft: "12px",
                  borderRadius: "8px"
                },
                "& .MuiInputBase-input": {
                  paddingLeft: "12px",
                  color: "#828282"
                }
              }}
            />
            <Button
              className="ml-2"
              disableElevation
              variant="contained"
              onClick={handleSendMessage}
              sx={{ textTransform: "none", backgroundColor: "#ff0000", "&:hover": { backgroundColor: "#ff0000" } }}
            >
              发送
            </Button>
            <div className="icon-button ml-2 mic-icon"></div>
            <div className="icon-button ml-2 emoji-icon"></div>
            <div className="icon-button ml-2 image-icon"></div>
          </div>
        </div>
        {showUserInfo && (
          <div className={`fixed top-0 right-0 h-full transition-transform duration-300 transform ${showUserInfo ? "translate-x-0" : "translate-x-full"} bg-white border-l border-gray-300 shadow-lg p-4 w-1/3`}>
            <div className="flex flex-col items-center">
              <img className="w-20 h-20 rounded-full mb-4 shadow-md" alt="User Avatar" src={userInfo?.avatar_file} />
              <div className="text-lg font-bold mb-2">{userInfo?.username}</div>
              <div className="text-sm text-gray-500 mb-4">Active 20m ago</div>
              <Button
                className="w-full bg-red-500 text-white rounded-full"
                disableElevation
                variant="contained"
                onClick={handleSellClick}
                sx={{ textTransform: "none", backgroundColor: "#ff0000", "&:hover": { backgroundColor: "#ff0000" } }}
              >
                他卖过的
              </Button>
            </div>
          </div>
        )}
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
          content: "🎤";
        }

        .icon-button.emoji-icon::before {
          content: "😀";
        }

        .icon-button.image-icon::before {
          content: "📷";
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
      {showUserInfo && <div className="fixed-overlay" onClick={() => setShowUserInfo(!showUserInfo)}></div>}
    </div>
  );
};

export default Frame8;
