import { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const FrameComponent4 = ({ className = "" }) => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = Cookies.get('authToken');
        if (!token) return;

        const response = await axios.get('http://106.52.158.123:5000/api/profile', { 
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        });
        setUserProfile(response.data);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        handleInvalidToken();
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (isLoggedIn && userProfile?.id) {
      const interval = setInterval(fetchUnreadMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn, userProfile?.id]);

  const fetchUnreadMessages = async () => {
    try {
      const response = await axios.get(`http://106.52.158.123:5000/api/chat/${userProfile.id}/unread_count`, {
        headers: { Authorization: `Bearer ${Cookies.get('authToken')}` },
        withCredentials: true
      });
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error('Error fetching unread messages:', error);
    }
  };

  const handleInvalidToken = useCallback(() => {
    Cookies.remove("authToken");
    setIsLoggedIn(false);
  }, []);

  const onHomeClick = useCallback(() => {
    window.location.href = "http://106.52.158.123:3000";
  }, []);

  const onTextClick = useCallback(() => {
    navigate("/1");
  }, [navigate]);

  const onTextClick1 = useCallback(() => {
    navigate("/2");
  }, [navigate]);

  const onMessageClick = useCallback(() => {
    if (isLoggedIn) {
      navigate(`/chat/${userProfile.id}`);
    } else {
      navigate("/4");
    }
  }, [isLoggedIn, userProfile, navigate]);

  const onTradeClick = useCallback(() => {
    if (isLoggedIn) {
      navigate(`/10/${userProfile.id}`);
    } else {
      navigate("/4");
    }
  }, [isLoggedIn, userProfile, navigate]);

  const onLogoutClick = useCallback(() => {
    Cookies.remove("authToken");
    setIsLoggedIn(false);
    setSidebarOpen(false);
  }, []);

  const onAvatarClick = useCallback(() => {
    setSidebarOpen(!sidebarOpen);
  }, [sidebarOpen]);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const onProfileClick = useCallback(() => {
    navigate(`/3/${userProfile.id}`);
  }, [userProfile, navigate]);

  return (
    <header className={`w-full flex flex-wrap items-center justify-between py-4 px-4 box-border text-left text-29xl text-red font-small-text ${className}`}>
      <div className="flex flex-row items-center gap-5 header-group">
        <img className="h-24 w-48 object-cover" loading="lazy" alt="Logo" src="/logo1-1@2x.png" />
        <h1 className="m-0 text-inherit leading-6 font-medium">
          <span className="text-red">GO</span>
          <span className="text-black">TONG</span>
        </h1>
      </div>
      <div className="flex flex-row items-center justify-center gap-6 header-group">
        <div className="flex items-center">
          <h1 className="m-0 text-xl leading-6 font-medium cursor-pointer" onClick={onHomeClick} style={{ color: 'black' }}>
            首页
          </h1>
        </div>
        <div className="flex items-center">
          <h1 className="m-0 text-xl leading-6 font-medium cursor-pointer" onClick={onTextClick} style={{ color: 'black' }}>
            采购端
          </h1>
        </div>
        <div className="flex items-center">
          <h1 className="m-0 text-xl leading-6 font-medium cursor-pointer" onClick={onTextClick1} style={{ color: 'black' }}>
            需求端
          </h1>
        </div>
      </div>
      <div className="flex flex-row items-center justify-end gap-5 text-base header-group">
        <div className="shadow-none rounded-lg bg-red flex items-center justify-center py-2.5 px-8 cursor-pointer hover:shadow-md relative" onClick={onMessageClick}>
          <div className="text-white">消息</div>
          {unreadCount > 0 && (
            <div className="absolute bottom-[-8px] right-[-8px] bg-white text-red rounded-full w-6 h-6 flex items-center justify-center text-xs">
              {unreadCount}
            </div>
          )}
        </div>
        <div className="shadow-none rounded-lg bg-red flex items-center justify-center py-2.5 px-8 cursor-pointer hover:shadow-md" onClick={onTradeClick}>
          <div className="text-white">交易</div>
        </div>
        {isLoggedIn ? (
          <div className="flex items-center justify-start pt-1.5 relative">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="loader"></div>
              </div>
            )}
            <button
              className={`h-16 w-16 rounded-full overflow-hidden focus:outline-none ${loading ? 'opacity-50' : 'opacity-100'} transition-shadow duration-300`}
              onClick={onAvatarClick}
              disabled={loading}
              style={{ boxShadow: '0px 0px 15px rgba(0,0,0,0.3)' }}
            >
              <img
                className="w-full h-full object-cover"
                src={userProfile?.avatar_file ? `http://106.52.158.123:5000/${userProfile.avatar_file}` : "/path/to/default-avatar.png"}
                alt="User Avatar"
              />
            </button>
          </div>
        ) : null}
      </div>
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <button className="close-button" onClick={closeSidebar} style={{ color: 'black' }}>{'<'}</button>
        <div className="sidebar-header">
          <img
            className="w-16 h-16 rounded-full object-cover"
            src={userProfile?.avatar_file ? `http://106.52.158.123:5000/${userProfile.avatar_file}` : "/path/to/default-avatar.png"}
            alt="User Avatar"
          />
          <div className="username">{userProfile?.username}</div>
          <button className="profile-button" onClick={onProfileClick}>个人主页</button>
        </div>
        <div className="sidebar-content">
          <div className="sidebar-section">
            <Button className="sidebar-button">隐私设置</Button>
            <Button className="sidebar-button">语言设置</Button>
            <Button className="sidebar-button">地区设置</Button>
          </div>
          <div className="sidebar-section">
            <Button className="sidebar-button" onClick={onLogoutClick}>登出</Button>
          </div>
        </div>
      </div>
      <style jsx>{`
        .loader {
          border: 4px solid #f3f3f3;
          border-top: 4px solid red;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .sidebar {
          position: fixed;
          top: 0;
          right: -300px;
          height: 100%;
          width: 300px;
          background-color: white;
          box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);
          z-index: 1000;
          transition: right 0.3s ease-in-out;
        }

        .sidebar.open {
          right: 0;
        }

        .close-button {
          position: absolute;
          top: 10px;
          left: 10px;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
        }

        .sidebar-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #e0e0e0;
        }

        .username {
          margin-top: 10px;
          font-size: 20px;
          color: black;
        }

        .profile-button {
          margin-top: 10px;
          border: 1px solid black;
          background-color: white;
          color: black;
          padding: 5px 10px;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
        }

        .profile-button:hover {
          background-color: lightgray;
        }

        .sidebar-content {
          padding: 20px;
        }

        .sidebar-section {
          border-bottom: 1px solid #e0e0e0;
          padding-bottom: 10px;
          margin-bottom: 10px;
        }

        .sidebar-button {
          width: 100%;
          text-align: left;
          padding: 10px;
          color: black;
          border: none;
          background: none;
          cursor: pointer;
          font-size: 14px;
        }

        .sidebar-button:hover {
          background-color: #f0f0f0;
        }

        @media (max-width: 768px) {
          .flex-wrap {
            flex-wrap: wrap;
          }
          .header-group {
            width: 100%;
            justify-content: center;
            margin-bottom: 16px;
          }
          .header-group:last-child {
            margin-bottom: 0;
          }
        }
      `}</style>
    </header>
  );
};

FrameComponent4.propTypes = {
  className: PropTypes.string,
};

export default FrameComponent4;
