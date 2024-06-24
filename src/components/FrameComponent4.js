import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";

const FrameComponent4 = ({ className = "" }) => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found in localStorage');
        return;
      }

      console.log('Fetching user profile with token:', token);
      const response = await axios.get('http://106.52.158.123:5000/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserProfile(response.data);
      setIsLoggedIn(true);
      console.log('User profile fetched successfully:', response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      if (error.response && error.response.status === 400 && error.response.data.includes('Invalid token')) {
        try {
          console.log('Token expired, attempting to refresh token.');
          const token = localStorage.getItem('token'); // 确保令牌已正确获取
          if (!token) {
            console.error('No token found in localStorage');
            return;
          }
          const refreshTokenResponse = await axios.post('http://106.52.158.123:5000/api/refresh-token', { token });
          const newToken = refreshTokenResponse.data.token;
          localStorage.setItem('token', newToken);
          console.log('Token refreshed successfully:', newToken);
          const retryResponse = await axios.get('http://106.52.158.123:5000/api/profile', {
            headers: { Authorization: `Bearer ${newToken}` }
          });
          setUserProfile(retryResponse.data);
          setIsLoggedIn(true);
          console.log('User profile fetched successfully with new token:', retryResponse.data);
        } catch (refreshError) {
          console.error('Error refreshing token:', refreshError.message);
        }
      }
    }
  };

  useEffect(() => {
    fetchUserProfile();
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
    if (isLoggedIn) {
      navigate("/5");
    } else {
      navigate("/4");
    }
  }, [isLoggedIn, navigate]);

  const onButtonContainerClick1 = useCallback(() => {
    if (isLoggedIn) {
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      navigate("/4");
    } else {
      navigate("/4");
    }
  }, [isLoggedIn, navigate]);

  const onAvatarClick = useCallback(() => {
    if (userProfile) {
      navigate(`/3/${userProfile.id}`);
    }
  }, [navigate, userProfile]);

  return (
    <header
      className={`w-full flex flex-row items-center justify-between py-4 px-4 box-border text-left text-29xl text-red font-small-text ${className}`}
    >
      <div className="flex flex-row items-center justify-start gap-5">
        <img
          className="h-24 w-48 object-cover"
          loading="lazy"
          alt="Logo"
          src="/logo1-1@2x.png"
        />
        <h1 className="m-0 relative text-inherit leading-6 font-medium font-inherit whitespace-nowrap">
          <span className="text-red">GO</span>
          <span className="text-black">TONG</span>
        </h1>
      </div>
      <div className="flex flex-row items-center justify-center gap-6">
        <div className="flex items-center">
          <h1
            className="m-0 text-xl leading-6 font-medium cursor-pointer"
            onClick={onHomeClick}
            style={{ color: 'black' }}
          >
            首页
          </h1>
        </div>
        <div className="flex items-center">
          <h1
            className="m-0 text-xl leading-6 font-medium cursor-pointer"
            onClick={onTextClick}
            style={{ color: 'black' }}
          >
            采购端
          </h1>
        </div>
        <div className="flex items-center">
          <h1
            className="m-0 text-xl leading-6 font-medium cursor-pointer"
            onClick={onTextClick1}
            style={{ color: 'black' }}
          >
            需求端
          </h1>
        </div>
      </div>
      <div className="flex flex-row items-center justify-end gap-5 text-base">
        <div
          className="shadow-none rounded-lg bg-red flex items-center justify-center py-2.5 px-8 cursor-pointer hover:shadow-md"
          onClick={onButtonContainerClick}
        >
          <div className="text-white">消息</div>
        </div>
        <div
          className="shadow-none rounded-lg bg-red flex items-center justify-center py-2.5 px-8 cursor-pointer hover:shadow-md"
          onClick={onButtonContainerClick1}
        >
          <div className="text-white">{isLoggedIn ? "登出" : "个人"}</div>
        </div>
        <div className="flex items-center justify-start pt-1.5">
          {isLoggedIn && userProfile ? (
            <img
              className="h-10 w-10 rounded-full object-cover cursor-pointer"
              src={userProfile.avatar_file || "/path/to/default-avatar.png"}
              alt="User Avatar"
              onClick={onAvatarClick}
            />
          ) : (
            <select className="h-10 bg-transparent border-none">
              <option value="option_1">Option 1</option>
            </select>
          )}
        </div>
      </div>
    </header>
  );
};

FrameComponent4.propTypes = {
  className: PropTypes.string,
};

export default FrameComponent4;
