import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { TextField, Button, MenuItem, Select } from "@mui/material";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import FrameComponent4 from "../components/FrameComponent4";

const Frame8 = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const currentUserId = parseInt(id, 10);
  const location = useLocation();
  const { contact_id: otherContactId } = location.state || {};
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [translatedMessages, setTranslatedMessages] = useState({});
  const [message, setMessage] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [contactTyping, setContactTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [newUserCount, setNewUserCount] = useState(0);
  const [showAdditionalOptions, setShowAdditionalOptions] = useState(false);
  const searchInputRef = useRef(null);
  const [selectedLanguage, setSelectedLanguage] = useState("zh");
  const [showLanguageOptions, setShowLanguageOptions] = useState(false);

  useEffect(() => {
    if (otherContactId) {
      addContactIfNotExist(otherContactId);
    }
    fetchContacts();
    notifyUserOpenedSite();
  }, [otherContactId]);

  useEffect(() => {
    const interval = setInterval(async () => {
      fetchContacts();
      fetchUserContacts();
      if (selectedContact) {
        const token = Cookies.get("authToken");
        if (!token) {
          console.error("No auth token found");
          return;
        }
        fetchChatMessages(selectedContact.contact_id, token);
        checkUserOnlineStatus(selectedContact.contact_id);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedContact]);

  useEffect(() => {
    if (selectedContact) {
      const token = Cookies.get("authToken");
      if (!token) {
        console.error("No auth token found");
        return;
      }
      fetchChatMessages(selectedContact.contact_id, token);
      checkUserOnlineStatus(selectedContact.contact_id);
    }
  }, [selectedContact]);

  const notifyUserOpenedSite = async () => {
    const token = Cookies.get("authToken");
    if (!token) {
      console.error("No auth token found");
      return;
    }
    try {
      await axios.post(`http://106.52.158.123:5000/api/user_opened_site/${currentUserId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error("Error notifying user opened site:", error);
    }
  };

  const fetchContacts = async () => {
    const token = Cookies.get("authToken");
    if (!token) {
      console.error("No auth token found");
      return;
    }
    try {
      const response = await axios.get(`http://106.52.158.123:5000/api/contacts/${currentUserId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const contactDetails = await Promise.all(response.data.map(async (contact) => {
        const userResponse = await axios.get(`http://106.52.158.123:5000/api/basic_profile/${contact.contact_id}`);
        return { contact_id: contact.contact_id, ...userResponse.data };
      }));

      setContacts(contactDetails);
      setFilteredContacts(contactDetails);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const fetchUserContacts = async () => {
    const token = Cookies.get("authToken");
    if (!token) {
      console.error("No auth token found");
      return;
    }
    try {
      const response = await axios.get(`http://106.52.158.123:5000/api/user_contacts/${currentUserId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.length > 0) {
        response.data.forEach(contact => addContactIfNotExist(contact.user_id));
      }
    } catch (error) {
      console.error("Error fetching user contacts:", error);
    }
  };

  const addContactIfNotExist = async (contactId) => {
    const token = Cookies.get("authToken");
    if (!token) {
      console.error("No auth token found");
      return;
    }
    try {
      await axios.post(
        "http://106.52.158.123:5000/api/contacts",
        {
          userId: currentUserId,
          contact_id: contactId,
          last_message: "",
          last_message_time: new Date().toISOString()
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchContacts();
    } catch (error) {
      if (error.response && error.response.status === 409) {
        console.log("Contact already exists");
      } else {
        console.error("Error adding contact:", error);
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
      const messages = response.data;
      setChatMessages(messages);
      const latestMessages = messages.slice(-5);
      latestMessages.forEach(async (message) => {
        if (message.sender_id !== currentUserId) {
          await checkAndTranslateMessage(message);
        }
      });
      scrollToBottom();
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };

  const checkAndTranslateMessage = async (message) => {
    const currentLanguage = selectedLanguage;
    const messageLanguage = await detectLanguage(message.message);
    if (currentLanguage !== messageLanguage) {
      const translatedText = await translateMessage(message.message, messageLanguage, currentLanguage);
      setTranslatedMessages(prev => ({ ...prev, [message.id]: translatedText }));
    }
  };

  const detectLanguage = async (text) => {
    try {
      const response = await axios.post('https://api.cognitive.microsofttranslator.com/detect?api-version=3.0', [{ Text: text }], {
        headers: {
          'Ocp-Apim-Subscription-Key': 'your_subscription_key',
          'Ocp-Apim-Subscription-Region': 'your_region',
          'Content-Type': 'application/json'
        }
      });
      return response.data[0].language;
    } catch (error) {
      console.error("Error detecting language:", error);
      return 'zh';
    }
  };

  const translateMessage = async (message, fromLang, toLang) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/translate`, {
        text: message,
        from: fromLang,
        to: toLang
      });
      return response.data.translatedText;
    } catch (error) {
      console.error('Error translating message:', error);
      return message;
    }
  };

  const handleSendMessage = async () => {
    const token = Cookies.get("authToken");
    if (!token) {
      console.error("No auth token found");
      return;
    }
    if (message.trim() && selectedContact) {
      try {
        const newMessage = { sender_id: currentUserId, receiver_id: selectedContact.contact_id, message };
        setChatMessages((prevMessages) => [...prevMessages, newMessage]);
        setMessage("");
        await axios.post(`http://106.52.158.123:5000/api/chat/${selectedContact.contact_id}`, newMessage, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        fetchChatMessages(selectedContact.contact_id, token);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    } else {
      setIsTyping(true);
      notifyTyping(true);
    }
  };

  const handleBlur = () => {
    setIsTyping(false);
    notifyTyping(false);
  };

  const notifyTyping = async (typing) => {
    const token = Cookies.get("authToken");
    if (!token) {
      console.error("No auth token found");
      return;
    }
    if (selectedContact) {
      try {
        await axios.post(`http://106.52.158.123:5000/api/online_status/${currentUserId}`, {
          online: true,
          typing: typing
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } catch (error) {
        console.error("Error updating typing status:", error);
      }
    }
  };

  const handleBackClick = () => {
    setSelectedContact(null);
    setChatMessages([]);
  };

  const handleSellClick = () => {
    navigate(`/3/${selectedContact.contact_id}`);
  };

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    setShowUserInfo(false);
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

  const checkUserOnlineStatus = async (contactId) => {
    try {
      const response = await axios.get(`http://106.52.158.123:5000/api/online_status/${contactId}`);
      setUserInfo((prevInfo) => ({ ...prevInfo, online: response.data.online, last_active: response.data.last_active, typing: response.data.typing }));
      setContactTyping(response.data.typing);
    } catch (error) {
      console.error("Error checking user online status:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setFilteredContacts(
      contacts.filter(
        (contact) =>
          contact.username.toLowerCase().includes(query) ||
          contact.contact_id.toString().includes(query)
      )
    );
  };

  const formatLastActiveTime = (lastActive) => {
    const now = new Date();
    const lastActiveDate = new Date(lastActive);
    const diffInMinutes = Math.floor((now - lastActiveDate) / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);

    if (diffInMinutes < 60) {
      return `${diffInMinutes}分钟前活跃`;
    } else if (diffInHours < 24) {
      return `${diffInHours}小时前活跃`;
    } else if (diffInDays < 30) {
      return `${diffInDays}天前活跃`;
    } else {
      return `${diffInMonths}月前活跃`;
    }
  };

  const toggleLanguageOptions = () => {
    setShowLanguageOptions(!showLanguageOptions);
  };

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
    setShowLanguageOptions(false);
    if (selectedContact) {
      fetchChatMessages(selectedContact.contact_id, Cookies.get("authToken"));
    }
  };

  return (
    <div className="relative flex flex-col h-screen w-full bg-gray-100">
      <FrameComponent4 newUserCount={newUserCount} />
      <div className="flex-1 flex p-5 box-border" style={{ borderTop: "1px solid #e0e0e0", borderBottom: "1px solid #e0e0e0" }}>
        <div className="transition-transform duration-1000 w-1/4" style={{ borderRight: "1px solid #e0e0e0", borderLeft: "1px solid #e0e0e0" }}>
          <div className="flex items-center justify-between p-4" style={{ borderBottom: "1px solid #e0e0e0", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}>
            <div className="cursor-pointer text-xl bg-gray-200 rounded-full p-2" onClick={handleBackClick}>
              {"<"}
            </div>
            <div className="text-lg font-bold">沟通过的人</div>
          </div>
          <div className="p-4" style={{ borderBottom: "1px solid #e0e0e0" }}>
            <TextField
              className="w-full"
              placeholder="搜索聊天"
              variant="outlined"
              inputRef={searchInputRef}
              onChange={handleSearchChange}
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
            {filteredContacts.map((contact, index) => (
              <div
                key={index}
                className={`flex items-center p-2 relative cursor-pointer ${selectedContact?.contact_id === contact.contact_id ? "bg-gray-400" : ""}`}
                style={{ borderBottom: "1px solid #e0e0e0" }}
                onClick={() => handleSelectContact(contact)}
              >
                <img className="w-10 h-10 rounded-full mr-4" alt="Avatar" src={contact.avatar_file} />
                <div className="flex flex-col">
                  <div className="font-bold">{contact.username}</div>
                  <div className="text-sm text-gray-500">{contact.last_message}</div>
                </div>
                {contact.newUser && (
                  <div className="absolute right-0 w-3 h-3 bg-red-500 rounded-full mr-4" />
                )}
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
        <div className={`flex-1 flex flex-col bg-white transition-transform duration-1000 ${selectedContact ? "ml-1/4" : ""}`} style={{ borderRight: "1px solid #e0e0e0" }}>
          <div className="flex items-center justify-between p-4" style={{ borderBottom: "1px solid #e0e0e0", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}>
            <div className="cursor-pointer text-xl" onClick={handleBackClick}>
              {selectedContact ? "<" : ">"}
            </div>
            {selectedContact && (
              <div className="flex items-center cursor-pointer">
                <span>{contactTyping ? "对方正在输入..." : ""}</span>
                <img className="w-10 h-10 rounded-full shadow-md ml-2" alt="Avatar" src={selectedContact.avatar_file} onClick={handleShowUserInfo} />
                <div className="ml-4">
                  <div className="font-bold">{selectedContact.username}</div>
                  <div className="text-sm text-gray-500">{userInfo?.online ? "在线" : formatLastActiveTime(userInfo?.last_active)}</div>
                </div>
                <Button 
                  onClick={toggleLanguageOptions}
                  sx={{
                    marginLeft: "10px",
                    backgroundColor: "#ff0000",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#ff0000",
                      boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.25)"
                    }
                  }}
                >
                  {selectedLanguage === "zh" ? "中文" : selectedLanguage === "yue" ? "粤语" : "英文"}
                </Button>
                {showLanguageOptions && (
                  <Select
                    value={selectedLanguage}
                    onChange={handleLanguageChange}
                    sx={{
                      position: "absolute",
                      top: "40px",
                      right: "10px",
                      backgroundColor: "#fff",
                      boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.25)",
                      zIndex: 10
                    }}
                  >
                    <MenuItem value="zh">中文</MenuItem>
                    <MenuItem value="yue">粤语</MenuItem>
                    <MenuItem value="en">英文</MenuItem>
                  </Select>
                )}
              </div>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-4" style={{ maxHeight: "70vh" }}>
            {chatMessages.map((message, index) => {
              const isCurrentUser = message.sender_id === currentUserId;
              return (
                <div key={index} className={`flex flex-col ${isCurrentUser ? "items-end" : "items-start"} mb-4`}>
                  <div
                    className={`p-4 max-w-2/3 break-words bubble ${isCurrentUser ? "bg-pink-200" : "bg-gray-200"}`}
                    style={{
                      borderRadius: "20px",
                      padding: "10px 20px",
                      wordWrap: "break-word",
                      whiteSpace: "pre-wrap",
                      marginRight: isCurrentUser ? "10px" : "0",
                      marginLeft: !isCurrentUser ? "10px" : "0"
                    }}
                    onClick={() => console.log("Message clicked:", message)}
                  >
                    {message.message}
                  </div>
                  {!isCurrentUser && translatedMessages[message.id] && (
                    <div
                      className="p-4 max-w-2/3 break-words bg-yellow-200 relative"
                      style={{
                        borderRadius: "20px",
                        padding: "10px 20px",
                        wordWrap: "break-word",
                        whiteSpace: "pre-wrap",
                        marginLeft: "10px",
                        position: "relative"
                      }}
                    >
                      {translatedMessages[message.id]}
                      <span style={{ fontSize: "10px", color: "#666", position: "absolute", right: "10px", bottom: "5px" }}>AI翻译</span>
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
          <div className="flex items-center p-4 relative" style={{ borderTop: "1px solid #e0e0e0", borderBottom: "1px solid #e0e0e0" }}>
            <div className="icon-button mic-icon mr-2"></div>
            <TextField
              className="flex-1"
              placeholder="输入消息"
              variant="outlined"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => setIsTyping(true)}
              onBlur={handleBlur}
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
            <div
              className="icon-button ml-2 add-icon"
              onClick={() => setShowAdditionalOptions(!showAdditionalOptions)}
            ></div>
            {showAdditionalOptions && (
              <div className="additional-options">
                <div className="icon-button emoji-icon"></div>
                <div className="icon-button image-icon"></div>
              </div>
            )}
          </div>
        </div>
        <div className={`fixed top-0 right-0 h-full bg-white border-l shadow-lg p-4 w-1/3 flex flex-col items-center user-info-sidebar ${showUserInfo ? "show" : "hide"}`} style={{ borderColor: "#e0e0e0" }}>
          <div className="flex items-center w-full mb-4">
            <div className="cursor-pointer text-xl" onClick={handleHideUserInfo}>
              {"<"}
            </div>
          </div>
          <img className="w-20 h-20 rounded-full mb-4 shadow-md" alt="User Avatar" src={userInfo?.avatar_file} />
          <div className="text-lg font-bold mb-2">{userInfo?.username}</div>
          <div className="text-sm text-gray-500 mb-4">{userInfo?.online ? "在线" : formatLastActiveTime(userInfo?.last_active)}</div>
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

        .icon-button.add-icon::before {
          content: "+";
        }

        .shadow-lg {
          box-shadow: -5px 0 15px rgba(0, 0, 0, 0.5);
        }

        .additional-options {
          position: absolute;
          top: -60px;
          right: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
          background-color: white;
          border: 1px solid #ccc;
          padding: 10px;
          border-radius: 8px;
          box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.25);
          z-index: 1;
        }

        .user-info-sidebar {
          transition: transform 0.5s ease-in-out;
        }

        .user-info-sidebar.hide {
          transform: translateX(100%);
        }

        .user-info-sidebar.show {
          transform: translateX(0);
        }

        .bubble {
          border-radius: 20px;
          padding: 10px;
          max-width: 66%;
          word-wrap: break-word;
          white-space: pre-wrap;
        }

        .bubble.bg-pink-200 {
          background-color: #f1c0c0;
        }

        .bubble.bg-gray-200 {
          background-color: #d1d1d1;
        }

        .flex.items-center.p-2.relative.cursor-pointer.bg-gray-200 {
          background-color: #f1f1f1;
        }

        .flex.items-center.p-2.relative.cursor-pointer.bg-gray-400 {
          background-color: #cccccc;
        }
      `}</style>
    </div>
  );
};

export default Frame8;
