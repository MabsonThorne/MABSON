import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";

const FrameComponent5 = ({ className = "" }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [bio, setBio] = useState('');
  const [gender, setGender] = useState('');
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get(`http://106.52.158.123:5000/api/profile/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserProfile(response.data);
        setBio(response.data.bio || '');
        setGender(response.data.gender || '');
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [id]);

  const onAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
  };

  const onBioChange = (e) => {
    setBio(e.target.value);
  };

  const onGenderChange = (e) => {
    setGender(e.target.value);
  };

  const onSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const formData = new FormData();
      formData.append('bio', bio);
      formData.append('gender', gender);
      if (avatar) {
        formData.append('avatar', avatar);
      }

      await axios.put(`http://106.52.158.123:5000/api/update-profile/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });

      navigate('/');
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  return (
    <div className={`w-full flex flex-col items-center justify-start py-4 px-4 box-border text-left text-29xl text-red font-small-text ${className}`}>
      <div className="flex flex-row items-center justify-start gap-5">
        <img className="h-24 w-48 object-cover" loading="lazy" alt="Logo" src="/logo1-1@2x.png" />
        <h1 className="m-0 relative text-inherit leading-6 font-medium font-inherit whitespace-nowrap">
          <span className="text-red">GO</span>
          <span className="text-black">TONG</span>
        </h1>
      </div>
      <div className="flex flex-col items-start justify-start gap-5 text-base mt-8">
        {userProfile && (
          <>
            <img className="h-10 w-10 rounded-full object-cover mb-4" src={userProfile.avatar_file || "/path/to/default-avatar.png"} alt="User Avatar" />
            <div>用户名: {userProfile.username}</div>
            <div>邮箱: {userProfile.email}</div>
          </>
        )}
        <input type="file" accept="image/*" onChange={onAvatarChange} className="mb-4" />
        <textarea value={bio} onChange={onBioChange} placeholder="简介" className="mb-4" />
        <select value={gender} onChange={onGenderChange} className="mb-4">
          <option value="male">男</option>
          <option value="female">女</option>
          <option value="other">其他</option>
        </select>
        <div className="shadow-none rounded-lg bg-red flex items-center justify-center py-2.5 px-8 cursor-pointer hover:shadow-md" onClick={onSubmit}>
          <div className="text-white">完成</div>
        </div>
      </div>
    </div>
  );
};

FrameComponent5.propTypes = {
  className: PropTypes.string,
};

export default FrameComponent5;
