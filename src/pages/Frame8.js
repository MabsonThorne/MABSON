import { useCallback, useEffect, useState } from "react";
import { TextField, Button } from "@mui/material";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import FrameComponent4 from "../components/FrameComponent4";

const Frame8 = () => {
  const navigate = useNavigate();
  const { id: currentUserId } = useParams();
  const location = useLocation();
  const targetUserId = location.state?.targetUserId;

  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const token = Cookies.get('authToken');
        const response = await axios.get('http://106.52.158.123:5000/api/contacts', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setContacts(response.data);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };

    const fetchUserInfo = async () => {
      try {
        const token = Cookies.get('authToken');
        const response = await axios.get(`http://106.52.158.123:5000/api/basic_profile/${targetUserId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserInfo(response.data);

        await axios.post('http://106.52.158.123:5000/api/contacts', {
          contact_id: targetUserId,
          last_message: '',
          last_message_time: new Date().toISOString()
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        fetchContacts(); // 更新联系人列表
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    const fetchChatMessages = async () => {
      try {
        const token = Cookies.get('authToken');
        const response = await axios.get(`http://106.52.158.123:5000/api/chat/${targetUserId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setChatMessages(response.data);
      } catch (error) {
        console.error('Error fetching chat messages:', error);
      }
    };

    fetchContacts();
    if (targetUserId) {
      fetchUserInfo();
      fetchChatMessages();
    }
  }, [targetUserId]);

  const handleSendMessage = async () => {
    if (message.trim()) {
      try {
        const token = Cookies.get('authToken');
        await axios.post(`http://106.52.158.123:5000/api/chat/${targetUserId}`, { message }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setChatMessages([...chatMessages, { sender_id: currentUserId, message }]);
        setMessage("");
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleContactClick = (contact) => {
    setSelectedContact(contact);
    navigate(`/chat/${currentUserId}`, { state: { targetUserId: contact.contact_id } });
  };

  const handleContactDelete = async (contactId) => {
    try {
      const token = Cookies.get('authToken');
      await axios.delete(`http://106.52.158.123:5000/api/contacts/${contactId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setContacts(contacts.filter(contact => contact.contact_id !== contactId));
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  return (
    <div className="relative flex flex-col h-screen w-full bg-gray-100">
      <FrameComponent4 />
      <div className="flex-1 flex p-5 box-border border-t border-gray-300">
        <div className="w-1/4 border-r border-gray-300">
          <div className="flex items-center justify-between p-4 border-b border-gray-300">
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
            {contacts.map((contact) => (
              <div key={contact.contact_id} className="flex items-center p-2 border-b border-gray-200">
                <img className="w-10 h-10 rounded-full mr-4" alt="Avatar" src={contact.avatar_file} />
                <div className="flex flex-col">
                  <div className="font-bold">{contact.username}</div>
                  <div className="text-sm text-gray-500">{contact.last_message}</div>
                </div>
                <button onClick={() => handleContactDelete(contact.contact_id)}>X</button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col bg-white">
          <div className="flex items-center justify-between p-4 border-b border-gray-300">
            <div className="flex items-center">
              {selectedContact && (
                <>
                  <img className="w-10 h-10 rounded-full cursor-pointer shadow-md" alt="Avatar" src={selectedContact.avatar_file} />
                  <div className="ml-4">
                    <div className="font-bold">{selectedContact.username}</div>
                    <div className="text-sm text-gray-500">Active 20m ago</div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {chatMessages.map((message, index) => (
              <div key={index} className={`flex ${message.sender_id === currentUserId ? 'justify-end' : 'justify-start'} mb-4`}>
                <div className={`p-4 rounded-lg ${message.sender_id === currentUserId ? 'bg-red-200 text-white' : 'bg-gray-200 text-black'}`}>
                  {message.message}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Frame8;
