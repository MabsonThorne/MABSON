import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { TextField, Button } from "@mui/material";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import FrameComponent4 from "../components/FrameComponent4";

const Frame8 = () => {
  const navigate = useNavigate();
  const { id: currentUserId } = useParams(); // 从 URL 获取当前用户 ID
  const location = useLocation();
  const { contact_id } = location.state || {}; // 从传递的 state 中获取 contact_id
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const messagesEndRef = useRef(null);

  // 第二个功能：时刻查找并返回数据传递给第一个功能
  const getUserIds = async () => {
    const token = Cookies.get("authToken");
    if (!token) {
      console.error("No auth token found");
      return [];
    }
    try {
      const response = await axios.post(
        "http://106.52.158.123:5000/api/user_contacts",
        { contactId: currentUserId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.length === 0) {
        console.log("No matching user IDs found.");
        return [];
      }
      console.log("Fetched user IDs:", response.data);
      return response.data.map(contact => contact.user_id);
    } catch (error) {
      console.error("Error fetching user IDs:", error);
      return [];
    }
  };

  // 第一个功能：获取contacts
  const fetchContacts = async (additionalContactIds = []) => {
    const token = Cookies.get("authToken");
    if (!token) {
      console.error("No auth token found");
      return;
    }
    console.log(`Fetching contacts with token: ${token}`);
    try {
      const response = await axios.get("http://106.52.158.123:5000/api/contacts", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(`Fetched contacts:`, response.data);

      const allContactIds = [...response.data.map(contact => contact.contact_id), ...additionalContactIds];
      const uniqueContactIds = [...new Set(allContactIds)];

      const contactDetails = await Promise.all(uniqueContactIds.map(async (contactId) => {
        const userResponse = await axios.get(`http://106.52.158.123:5000/api/basic_profile/${contactId}`);
        return { contact_id: contactId, ...userResponse.data };
      }));

      setContacts(contactDetails.sort((a, b) => new Date(b.last_message_time) - new Date(a.last_message_time)));
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  // 获取传递过来的contact_id并立即生成名片
  useEffect(() => {
    if (contact_id) {
      fetchContacts([contact_id]);
    }
  }, [contact_id]);

  // 定期执行第一个功能并将第二个功能返回的user_id作为contact_id传递给第一个功能
  useEffect(() => {
    const interval = setInterval(async () => {
      const userIds = await getUserIds();
      const additionalContactIds = userIds.filter(id => id !== currentUserId); // 过滤掉当前页面的id
      fetchContacts(additionalContactIds);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // 选中联系人后获取聊天消息
  useEffect(() => {
    if (selectedContact) {
      const token = Cookies.get("authToken");
      if (!token) {
        console.error("No auth token found");
        return;
      }
      axios.get(`http://106.52.158.123:5000/api/chat/${selectedContact.contact_id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        setChatMessages(response.data);
        scrollToBottom();
      })
      .catch(error => console.error("Error fetching chat messages:", error));
    }
  }, [selectedContact]);

  // 发送消息
  const handleSendMessage = async () => {
    const token = Cookies.get("authToken");
    if (!token) {
      console.error("No auth token found");
      return;
    }
    if (message.trim() && selectedContact) {
      try {
        const newMessage = { sender_id: currentUserId, receiver_id: selectedContact.contact_id, message };
        setChatMessages([...chatMessages, newMessage]); // 立即显示消息
        setMessage("");
        await axios.post(`http://106.52.158.123:5000/api/chat/${selectedContact.contact_id}`, newMessage, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        fetchChatMessages(selectedContact.contact_id, token); // 确保消息发送成功后刷新消息列表
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const fetchChatMessages = async (contactId, token) => {
    try {
      const response = await axios.get(`http://106.52.158.123:5000/api/chat/${contactId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setChatMessages(response.data);
      scrollToBottom();
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleBackClick = () => {
    setSelectedContact(null);
  };

  const handleSellClick = () => {
    navigate(`/3/${selectedContact.contact_id}`);
  };

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    setShowUserInfo(false); // Reset user info panel state
    setChatMessages([]); // Reset chat messages
    const token = Cookies.get("authToken");
    if (!token) {
      console.error("No auth token found");
      return;
    }
    fetchChatMessages(contact.contact_id, token);
  };

  const handleDeleteContact = async (contactId) => {
    const token = Cookies.get("authToken");
    if (!token) {
      console.error("No auth token found");
      return;
    }
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

  const handleShowUserInfo = async () => {
    if (selectedContact) {
      try {
        const response = await axios.get(`http://106.52.158.123:5000/api/basic_profile/${selectedContact.contact_id}`);
        setUserInfo(response.data);
        setShowUserInfo(true);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    }
  };

  const handleHideUserInfo = () => {
    setShowUserInfo(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative flex flex-col h-screen w-full bg-gray-100">
      <FrameComponent4 />
      <div className="flex-1 flex p-5 box-border border-t border-gray-300">
        <div className="transition-transform duration-1000 w-1/4 border-r border-gray-300">
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
              <div
                key={index}
                className={`flex items-center p-2 border-b border-gray-200 relative cursor-pointer ${selectedContact?.contact_id === contact.contact_id ? "bg-gray-200" : ""}`}
                onClick={() => handleSelectContact(contact)}
              >
                <img className="w-10 h-10 rounded-full mr-4" alt="Avatar" src={contact.avatar_file} />
                <div className="flex flex-col">
                  <div className="font-bold">{contact.username}</div>
                  <div className="text-sm text-gray-500">{contact.last_message}</div>
                </div>
                <button
                  className="absolute right-0 p-2 text-red-500"
                  onClick={(e) => { e.stopPropagation(); handleDeleteContact(contact.contact_id); }}
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className={`flex-1 flex flex-col bg-white transition-transform duration-1000 ${selectedContact ? "ml-1/4" : ""}`}>
          <div className="flex items-center justify-between p-4 border-b border-gray-300">
            <div className="cursor-pointer text-xl" onClick={handleBackClick}>
              {selectedContact ? "<" : ">"}
            </div>
            {selectedContact && (
              <div className="flex items-center cursor-pointer" onClick={handleShowUserInfo}>
                <img className="w-10 h-10 rounded-full shadow-md" alt="Avatar" src={selectedContact.avatar_file} />
                <div className="ml-4">
                  <div className="font-bold">{selectedContact.username}</div>
                  <div className="text-sm text-gray-500">Active 20m ago</div>
                </div>
              </div>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-4" style={{ maxHeight: "70vh" }}>
            {chatMessages.map((message, index) => (
              <div key={index} className={`flex ${message.sender_id === currentUserId ? "justify-end" : "justify-start"} mb-4`}>
                <div className={`p-4 rounded-lg max-w-2/3 break-words ${message.sender_id === currentUserId ? "bg-red-200 text-white" : "bg-gray-200 text-black"}`}>
                  {message.message}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
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
              sx={{ 
                textTransform: "none", 
                backgroundColor: "#ff0000", 
                "&:hover": { 
                  backgroundColor: "#ff0000",
                  boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.25)" 
                } 
              }}
            >
              发送
            </Button>
            <div className="icon-button ml-2 mic-icon"></div>
            <div className="icon-button ml-2 emoji-icon"></div>
            <div className="icon-button ml-2 image-icon"></div>
          </div>
        </div>
        {showUserInfo && (
          <div className={`fixed top-0 right-0 h-full transition-transform duration-1000 transform ${showUserInfo ? "translate-x-0" : "translate-x-full"} bg-white border-l border-gray-300 shadow-lg p-4 w-1/3`}>
            <div className="flex flex-col items-center">
              <img className="w-20 h-20 rounded-full mb-4 shadow-md" alt="User Avatar" src={userInfo?.avatar_file} />
              <div className="text-lg font-bold mb-2">{userInfo?.username}</div>
              <div className="text-sm text-gray-500 mb-4">Active 20m ago</div>
              <Button
                className="w-full bg-red-500 text-white rounded-full"
                disableElevation
                variant="contained"
                onClick={handleSellClick}
                sx={{ 
                  textTransform: "none", 
                  backgroundColor: "#ff0000", 
                  "&:hover": { 
                    backgroundColor: "#ff0000",
                    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.25)" 
                  } 
                }}
              >
                {userInfo?.gender === "female" ? "她卖过的" : "他卖过的"}
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
      {showUserInfo && <div className="fixed-overlay" onClick={handleHideUserInfo}></div>}
    </div>
  );
};

export default Frame8;
