import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";
import Cookies from "js-cookie";

const FrameComponent4 = ({ className = "" }) => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = Cookies.get('authToken');
        if (!token) {
          setIsLoading(false);
          return;
        }

        const response = await axios.get('http://106.52.158.123:5000/api/profile', { 
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true 
        });
        setUserProfile(response.data);
        setIsLoggedIn(true);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        handleInvalidToken();
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

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

  const onButtonContainerClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const onButtonContainerClick1 = useCallback(() => {
    if (isLoggedIn) {
      navigate("/7");
    } else {
      navigate("/4");
    }
  }, [isLoggedIn, navigate]);

  const onLogoutClick = useCallback(() => {
    Cookies.remove("authToken");
    setIsLoggedIn(false);
  }, []);

  const onAvatarClick = useCallback(() => {
    if (userProfile && userProfile.id) {
      navigate(`/3/${userProfile.id}`);
    }
  }, [navigate, userProfile]);

  return (
    <header className={`w-full flex flex-col md:flex-row items-center justify-between py-4 px-4 box-border text-left text-29xl text-red font-small-text ${className}`}>
      <div className="flex flex-row items-center justify-start gap-5">
        <img className="h-24 w-48 object-cover" loading="lazy" alt="Logo" src="/logo1-1@2x.png" />
        <h1 className="m-0 relative text-inherit leading-6 font-medium font-inherit whitespace-nowrap">
          <span className="text-red">GO</span>
          <span className="text-black">TONG</span>
        </h1>
      </div>
      <div className="flex flex-row items-center justify-center gap-6 mt-4 md:mt-0">
        <div className="flex items-center">
          <h1 className="m-0 text-xl leading-6 font-medium cursor-pointer" onClick={onHomeClick} style={{ color: 'black' }}>首页</h1>
        </div>
        <div className="flex items-center">
          <h1 className="m-0 text-xl leading-6 font-medium cursor-pointer" onClick={onTextClick} style={{ color: 'black' }}>采购端</h1>
        </div>
        <div className="flex items-center">
          <h1 className="m-0 text-xl leading-6 font-medium cursor-pointer" onClick={onTextClick1} style={{ color: 'black' }}>需求端</h1>
        </div>
      </div>
      <div className="flex flex-row items-center justify-end gap-5 text-base mt-4 md:mt-0">
        <div className="shadow-none rounded-lg bg-red flex items-center justify-center py-2.5 px-8 cursor-pointer hover:shadow-md" onClick={onButtonContainerClick}>
          <div className="text-white">消息</div>
        </div>
        {isLoggedIn ? (
          <>
            <div className="shadow-none rounded-lg bg-red flex items-center justify-center py-2.5 px-8 cursor-pointer hover:shadow-md" onClick={onLogoutClick}>
              <div className="text-white">登出</div>
            </div>
            <div className="relative">
              {isLoading && <div className="loader"></div>}
              <img
                className={`h-10 w-10 rounded-full object-cover cursor-pointer ${isLoading ? 'hidden' : ''}`}
                src={userProfile?.avatar_file || "/path/to/default-avatar.png"}
                alt="User Avatar"
                onClick={onAvatarClick}
                style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
              />
            </div>
          </>
        ) : (
          <div className="shadow-none rounded-lg bg-red flex items-center justify-center py-2.5 px-8 cursor-pointer hover:shadow-md" onClick={onButtonContainerClick1}>
            <div className="text-white">个人</div>
          </div>
        )}
      </div>
      <style jsx>{`
        .loader {
          border: 4px solid #f3f3f3;
          border-top: 4px solid red;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 2s linear infinite;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </header>
  );
};

FrameComponent4.propTypes = {
  className: PropTypes.string,
};

export default FrameComponent4;
