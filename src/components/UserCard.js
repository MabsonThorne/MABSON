import { useMemo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserCard = ({ className = "", userId, propWidth, propMinWidth }) => {
  const navigate = useNavigate();
  const cardStyle = useMemo(() => ({
    width: propWidth,
    minWidth: propMinWidth,
    borderRadius: '15px', // 添加圆角效果
    backgroundColor: 'white', // 白色背景
    border: '1px solid #ccc', // 添加边框
    padding: '10px', // 添加内边距
    cursor: 'pointer' // 鼠标悬停时显示指针
  }), [propWidth, propMinWidth]);

  const [userData, setUserData] = useState({ avatar: '', name: '', bio: '', rating: '' });
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://106.52.158.123:5000/api/profile/${userId}`);
        setUserData({
          avatar: response.data.avatar_file,
          name: response.data.username,
          bio: response.data.bio,
          rating: response.data.rating
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  useEffect(() => {
    if (userData.avatar) {
      const img = new Image();
      img.src = userData.avatar;
      img.onload = () => setImageLoaded(true);
    }
  }, [userData.avatar]);

  const handleClick = () => {
    navigate(`/3/${userId}`);
  };

  return (
    <div 
      onClick={handleClick} 
      className={`flex flex-col items-start justify-start gap-6 min-w-[200px] max-w-full text-left text-xl text-black font-medium ${className}`} 
      style={cardStyle}
    >
      <div 
        className={`w-full relative rounded-lg overflow-hidden shrink-0 ${imageLoaded ? 'object-cover' : 'flex items-center justify-center bg-gray-200'}`} 
        style={{ height: 'auto', aspectRatio: '1/1' }}
      >
        {!imageLoaded && <div className="spinner"></div>}
        <img 
          className={`w-full ${imageLoaded ? 'object-cover' : 'hidden'}`} 
          loading="lazy" 
          alt="" 
          src={userData.avatar} 
        />
      </div>
      <div className="w-full flex flex-col items-start justify-center gap-1">
        <div className="relative leading-[150%]">{userData.name}</div>
        <div className="relative leading-[150%] text-gray">{userData.bio}</div>
        <div className="relative leading-[150%]">评分：{userData.rating}</div>
      </div>
    </div>
  );
};

UserCard.propTypes = {
  className: PropTypes.string,
  userId: PropTypes.string.isRequired,
  propWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  propMinWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default UserCard;
