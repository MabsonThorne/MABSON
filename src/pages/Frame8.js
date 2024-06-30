import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { TextField, Button } from "@mui/material";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import FrameComponent4 from "../components/FrameComponent4";

const Frame8 = () => {
  const navigate = useNavigate();
  const { id: currentUserId } = useParams();
  const location = useLocation();
  const { contact_id: otherContactId } = location.state || {};
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const messagesEndRef = useRef(null);
  const [newUserCount, setNewUserCount] = useState(0);
  const [showAdditionalOptions, setShowAdditionalOptions] = useState(false);
  const searchInputRef = useRef(null);

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

  const handleSendMessage = async () => {
    const token = Cookies.get("authToken");
    if (!token) {
      console.error("No auth token found");
      return;
    }
    if (message.trim() && selectedContact) {
      try {
        const newMessage = { sender_id: currentUserId, receiver_id: selectedContact.contact_id, message };
        setChatMessages([...chatMessages, newMessage]);
        setMessage("");
        await axios.post(`http://106.52.158.123:5000/api/chat/${selectedContact.contact_id}`, newMessage, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        await axios.post(
          "http://106.52.158.123:5000/api/contacts",
          {
            userId: currentUserId,
            contact_id: selectedContact.contact_id,
            last_message: message,
            last_message_time: new Date().toISOString()
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        fetchChatMessages(selectedContact.contact_id, token);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  useEffect(() => {
    if (otherContactId) {
      addContactIfNotExist(otherContactId);
    }
    fetchContacts();
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
    }
  }, [selectedContact]);

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
      setChatMessages(response.data);
      scrollToBottom();
    } catch (error) {
      console.error("Error fetching chat messages:", error);
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

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
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
    setChatMessages([]);
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

  const handleClickOutside = (event) => {
    if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
      setFilteredContacts(contacts);
    }
    if (showAdditionalOptions && !event.target.closest(".additional-options")) {
      setShowAdditionalOptions(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative flex flex-col h-screen w-full bg-gray-100">
      <FrameComponent4 newUserCount={newUserCount} />
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
                className={`flex items-center p-2 border-b border-gray-200 relative cursor-pointer ${selectedContact?.contact_id === contact.contact_id ? "bg-gray-200" : ""}`}
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
                  <div className="text-sm text-gray-500">20分钟前活跃</div>
                </div>
              </div>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-4" style={{ maxHeight: "70vh" }}>
            {chatMessages.map((message, index) => (
              <div key={index} className={`flex ${message.sender_id === currentUserId ? "justify-end" : "justify-start"} mb-4`}>
                <div
                  className={`p-4 max-w-2/3 break-words ${message.sender_id === currentUserId ? "bg-red-200 text-white" : "bg-gray-200 text-black"}`}
                  style={{
                    borderRadius: "20px",
                    padding: "10px 20px",
                    wordWrap: "break-word",
                    whiteSpace: "pre-wrap",
                    marginRight: message.sender_id === currentUserId ? "10px" : "0",
                    marginLeft: message.sender_id !== currentUserId ? "10px" : "0"
                  }}
                >
                  {message.message}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="flex items-center p-4 border-t border-gray-300 relative">
            <div className="icon-button mic-icon mr-2"></div>
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
        {showUserInfo && (
          <div className={`fixed top-0 right-0 h-full transition-transform duration-1000 transform ${showUserInfo ? "translate-x-0" : "translate-x-full"} bg-white border-l border-gray-300 shadow-lg p-4 w-1/3`}>
            <div className="flex flex-col items-center">
              <img className="w-20 h-20 rounded-full mb-4 shadow-md" alt="User Avatar" src={userInfo?.avatar_file} />
              <div className="text-lg font-bold mb-2">{userInfo?.username}</div>
              <div className="text-sm text-gray-500 mb-4">20分钟前活跃</div>
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

        .icon-button.add-icon::before {
          content: "+";
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
      `}</style>
      {showUserInfo && <div className="fixed-overlay" onClick={handleHideUserInfo}></div>}
    </div>
  );
};

export default Frame8;
