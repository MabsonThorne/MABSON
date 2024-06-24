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
  const [avatarPreview, setAvatarPreview] = useState(null);

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
        setAvatarPreview(response.data.avatar_file || '');
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [id]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleBioChange = (e) => {
    setBio(e.target.value);
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  const handleSubmit = async () => {
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
    <div
      className={`w-[1171px] flex flex-row items-start justify-center gap-[87px] max-w-full text-left text-181xl text-darkgray font-small-text lg:flex-wrap lg:gap-[43px] mq750:gap-[22px] ${className}`}
    >
      <div className="flex-[0.925] rounded-xl bg-gainsboro-100 overflow-hidden flex flex-col items-center justify-center py-[142px] pr-5 pl-[21px] box-border min-w-[356px] min-h-[613px] max-w-full lg:flex-1 lg:min-h-[auto] mq750:pt-[92px] mq750:pb-[92px] mq750:box-border mq750:min-w-full">
        {avatarPreview ? (
          <img src={avatarPreview} alt="Avatar Preview" className="w-[134px] h-[134px] object-cover" />
        ) : (
          <button
            onClick={() => document.getElementById('avatarInput').click()}
            className="m-0 w-[134px] h-[134px] text-inherit leading-[150%] font-medium font-inherit flex items-center justify-center mq1050:text-61xl mq1050:leading-[180px] mq450:text-31xl mq450:leading-[120px] border-none bg-transparent cursor-pointer"
          >
            +
          </button>
        )}
        <input
          id="avatarInput"
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          className="hidden"
        />
      </div>
      <div className="flex-1 flex flex-col items-start justify-start pt-[86px] px-0 pb-0 box-border min-w-[349px] max-w-full text-21xl text-gray-100 lg:flex-1 mq750:pt-14 mq750:box-border mq750:min-w-full">
        <div className="self-stretch flex flex-col items-start justify-start gap-[118px] max-w-full mq750:gap-[59px] mq450:gap-[29px]">
          <div className="self-stretch flex flex-row items-start justify-start py-0 pr-0 pl-[22px] box-border max-w-full">
            <div className="flex-1 flex flex-col items-start justify-start gap-[24px] max-w-full">
              {userProfile && (
                <>
                  <h1 className="m-0 self-stretch relative text-inherit leading-[110%] font-semibold font-inherit text-text-primary mq1050:text-13xl mq1050:leading-[35px] mq450:text-5xl mq450:leading-[26px]">
                    {userProfile.username}
                  </h1>
                  <h3 className="m-0 self-stretch relative text-5xl leading-[150%] font-normal font-inherit mq450:text-lgi mq450:leading-[29px]">
                    简介
                  </h3>
                  <textarea
                    className="self-stretch h-[60px] relative text-xl leading-[150%] font-medium flex items-center mq450:text-base mq450:leading-[24px]"
                    value={bio}
                    onChange={handleBioChange}
                  />
                  <div className="self-stretch relative text-xl leading-[150%] font-medium flex items-center mq450:text-base mq450:leading-[24px]">
                    <p className="m-0">{userProfile.email}</p>
                  </div>
                  <div className="self-stretch h-[60px] relative text-xl leading-[150%] font-medium flex items-center mq450:text-base mq450:leading-[24px]">
                    <select value={gender} onChange={handleGenderChange}>
                      <option value="male">男</option>
                      <option value="female">女</option>
                      <option value="other">其他</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>
          <div
            className="w-[515px] shadow-[0px_1px_2px_rgba(0,_0,_0,_0.05)] rounded-lg bg-red flex flex-row items-start justify-center py-3.5 px-5 box-border max-w-full cursor-pointer text-17xl text-white"
            onClick={handleSubmit}
          >
            <h1 className="m-0 relative text-inherit leading-[150%] font-medium font-inherit inline-block min-w-[72px] mq1050:text-10xl mq1050:leading-[43px] mq450:text-3xl mq450:leading-[32px]">
              完成
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

FrameComponent5.propTypes = {
  className: PropTypes.string,
};

export default FrameComponent5;
