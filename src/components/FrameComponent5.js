import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";
import { FaMale, FaFemale } from "react-icons/fa";

const FrameComponent5 = ({ className = "" }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [bio, setBio] = useState('');
  const [gender, setGender] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
        setUsername(response.data.username || '');
        setEmail(response.data.email || '');
        setBirthdate(response.data.birthdate || '');
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [id]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
  };

  const handleBioChange = (e) => {
    setBio(e.target.value);
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  const handleBirthdateChange = (e) => {
    setBirthdate(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const formData = new FormData();
      formData.append('bio', bio);
      formData.append('gender', gender);
      formData.append('birthdate', birthdate);
      formData.append('description', description);
      if (avatar) {
        formData.append('avatar', avatar);
      }

      await axios.post(`http://106.52.158.123:5000/api/update-profile/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess('Profile updated successfully');
      navigate('/');
    } catch (error) {
      console.error('Error updating user profile:', error);
      setError('Failed to update profile');
    }
  };

  return (
    <div>
      <section className="w-[1249px] flex flex-row items-start justify-center pt-0 px-0 pb-[166px] box-border gap-[109px] max-w-full text-left text-21xl text-gray-100 font-small-text mq750:gap-[54px] mq1050:pb-[108px] mq1050:box-border mq450:gap-[27px] mq450:pb-[70px] mq450:box-border mq1125:flex-wrap">
        <div className="relative h-[613px] flex-1 rounded-xl max-w-full min-w-[406px] overflow-hidden">
          <label htmlFor="avatar-upload" className="cursor-pointer flex items-center justify-center h-full w-full bg-gray-300 rounded-xl">
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
              onChange={handleBioChange}
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
                  onChange={handleBirthdateChange}
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
                    onChange={handleGenderChange}
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
                    onChange={handleGenderChange}
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
              className="cursor-pointer border-none py-3.5 px-10 bg-red-500 shadow-[0px_1px_2px_rgba(0,_0,_0,_0.05)] rounded-lg flex flex-row items-start justify-start hover:bg-red-400"
              onClick={handleSubmit}
            >
              <b className="m-0 relative text-inherit leading-[150%] font-medium font-inherit inline-block min-w-[72px] mq1050:text-10xl mq1050:leading-[43px] mq450:text-3xl mq450:leading-[32px]">
                完成
              </b>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

FrameComponent5.propTypes = {
  className: PropTypes.string,
};

export default FrameComponent5;
