import React, { useState, useEffect } from "react";
import axios from "axios";
import imageCompression from 'browser-image-compression';
import { FaMale, FaFemale } from "react-icons/fa";

const FrameComponent5 = ({ userId }) => {
  const [avatar, setAvatar] = useState(null);
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchPublicUserProfile = async () => {
      try {
        const response = await axios.get(`http://106.52.158.123:5000/api/public_profile/${userId}`);
        const data = response.data;
        setUsername(data.username || '');
        setEmail(data.email || '');
      } catch (error) {
        console.error('Error fetching public user profile:', error);
        setError('Failed to fetch public user profile');
      }
    };

    if (userId) {
      fetchPublicUserProfile();
    }
  }, [userId]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const compressedAvatar = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 800,
          useWebWorker: true
        });
        setAvatar(compressedAvatar);
      } catch (error) {
        console.error('Error compressing image:', error);
        setError('Failed to compress image');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    if (avatar) {
      formData.append('avatar_file', avatar);
    }
    formData.append('bio', bio);
    formData.append('birthdate', birthdate);
    formData.append('gender', gender);

    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.put(`http://106.52.158.123:5000/api/user_profiles/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true
      });
      setSuccess("Profile updated successfully");
      setTimeout(() => {
        window.location.href = 'http://106.52.158.123:3000/7';
      }, 3000);
    } catch (error) {
      setError(error.response ? error.response.data.message : error.message);
    }
  };

  return (
    <div className="w-full relative bg-white overflow-hidden flex flex-col items-start justify-start pt-14 px-20 pb-12 box-border gap-56 leading-normal tracking-normal text-left text-21xl text-red-200 font-small-text mq750:gap-28 mq750:px-10 mq450:gap-14">
      <section className="w-[1249px] flex flex-row items-start justify-center pt-0 px-0 pb-[166px] box-border gap-[109px] max-w-full text-left text-21xl text-gray-100 font-small-text mq750:gap-[54px] mq1050:pb-[108px] mq1050:box-border mq450:gap-[27px] mq450:pb-[70px] mq450:box-border mq1125:flex-wrap">
        <div className="relative h-[613px] flex-1 rounded-xl max-w-full min-w-[406px] overflow-hidden bg-gray-200">
          <label
            htmlFor="avatar-upload"
            className="cursor-pointer flex items-center justify-center h-full w-full rounded-xl border border-black hover:shadow-lg"
          >
            {avatar ? (
              <img
                className="absolute inset-0 w-full h-full object-cover rounded-xl"
                src={URL.createObjectURL(avatar)}
                alt="Avatar Preview"
              />
            ) : (
              <span className="text-gray-500 text-6xl">+</span>
            )}
          </label>
          <input
            id="avatar-upload"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleAvatarChange}
          />
        </div>
        <div className="w-[515px] flex flex-col items-start justify-start pt-[86px] px-0 pb-0 box-border min-w-[515px] max-w-full mq750:min-w-full mq1125:flex-1">
          <div className="self-stretch flex flex-col items-start justify-start gap-[24px]">
            <b className="self-stretch relative leading-[110%] font-semibold text-text-primary mq1050:text-13xl mq1050:leading-[35px] mq450:text-5xl mq450:leading-[26px]">
              {username}
            </b>
            <textarea
              className="self-stretch relative text-5xl leading-[150%] font-normal"
              placeholder="简介"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
            <div className="self-stretch h-[60px] relative text-xl leading-[150%] font-medium flex items-center mq450:text-base mq450:leading-[24px]">
              <span className="[line-break:anywhere]">
                <p className="m-0">邮箱: {email}</p>
              </span>
            </div>
            <div className="self-stretch h-[60px] relative text-xl leading-[150%] font-medium flex items-center mq450:text-base mq450:leading-[24px]">
              <span className="[line-break:anywhere]">
                <p className="m-0">出生日期:</p>
                <input
                  type="date"
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                  className="ml-2"
                />
              </span>
            </div>
            <div className="self-stretch h-[60px] relative text-xl leading-[150%] font-medium flex items-center mq450:text-base mq450:leading-[24px]">
              <span className="[line-break:anywhere]">
                <p className="m-0">性别:</p>
                <div className="flex items-center ml-2">
                  <input
                    type="radio"
                    id="male"
                    name="gender"
                    value="male"
                    checked={gender === 'male'}
                    onChange={(e) => setGender(e.target.value)}
                    className="mr-1"
                  />
                  <label htmlFor="male" className="mr-4 flex items-center">
                    <FaMale className="mr-1" /> 男
                  </label>
                  <input
                    type="radio"
                    id="female"
                    name="gender"
                    value="female"
                    checked={gender === 'female'}
                    onChange={(e) => setGender(e.target.value)}
                    className="mr-1"
                  />
                  <label htmlFor="female" className="flex items-center">
                    <FaFemale className="mr-1" /> 女
                  </label>
                </div>
              </span>
            </div>
            {error && <div className="text-red-500">{error}</div>}
            {success && <div className="text-green-500">{success}</div>}
            <button
              className="cursor-pointer py-3.5 text-white rounded-lg"
              onClick={handleSubmit}
              style={{
                width: '100%',
                textAlign: 'center',
                border: 'none',
                backgroundColor: 'red',
                boxShadow: 'none',
                transition: 'box-shadow 0.3s ease-in-out'
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0px 8px 15px rgba(0, 0, 0, 0.3)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
            >
              <b className="text-lg font-semibold block">
                完成
              </b>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FrameComponent5;
