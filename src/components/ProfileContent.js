import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { useNavigate, useParams } from "react-router-dom";

const ProfileContent = ({ className = "" }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [nickname, setNickname] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`http://106.52.158.123:5000/api/basic_profile/${id}`);
        setUserProfile(response.data);
        setNickname(response.data.username);
        setBio(response.data.bio);
        setEmail(response.data.email);
        setAvatar(response.data.avatar_file);
        setCurrentUserId(response.data.id);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setIsLoading(false);
      }
    };

    if (id) {
      fetchUserProfile();
    }
  }, [id]);

  const handleAvatarClick = useCallback(() => {
    if (isEditing) {
      document.getElementById('avatar-upload').click();
    } else {
      alert('Enlarging image is not implemented yet.');
    }
  }, [isEditing]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('avatar_file', file);

      try {
        const token = Cookies.get('authToken');
        const response = await axios.put(`http://106.52.158.123:5000/api/user_profiles/${id}`, formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
          withCredentials: true
        });
        setAvatar(response.data.avatar_file);
        setIsLoading(false);
      } catch (error) {
        console.error('Error uploading avatar:', error);
      }
    }
  };

  const handleEditClick = () => {
    if (isEditing) {
      const updateProfile = async () => {
        try {
          const token = Cookies.get('authToken');
          const response = await axios.put(`http://106.52.158.123:5000/api/user_profiles/${id}`, {
            username: nickname,
            bio: bio
          }, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
          });

          if (response.status === 200) {
            setIsEditing(false);
            window.location.reload();
          }
        } catch (error) {
          console.error('Error updating profile:', error);
        }
      };

      updateProfile();
    } else {
      setIsEditing(true);
    }
  };

  return (
    <section className={`w-full flex flex-col lg:flex-row items-start justify-start gap-6 p-4 ${className}`}>
      <div className="flex flex-col items-start justify-end w-full lg:w-2/3">
        <div className="flex flex-col items-start justify-start gap-6 w-full">
          <h1 className="text-2xl lg:text-4xl font-bold">发布过的</h1>
          <div className="flex flex-wrap items-start justify-start gap-6 w-full">
            {/* Replace the Card1 components with your actual components */}
          </div>
          <div className="flex items-center justify-center w-full text-base">
            <div className="flex items-center justify-start gap-2 p-2 bg-gray-100 rounded-xl">
              <button className="py-2 px-4 bg-gray-200 rounded-lg">上一页</button>
              <div className="w-16 text-center">？/？</div>
              <button className="py-2 px-4 bg-gray-200 rounded-lg">下一页</button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start justify-start w-full lg:w-1/3">
        <div className="relative w-full h-96">
          {isLoading && <div className="loader"></div>}
          <img
            className={`w-full h-full rounded-xl object-cover cursor-pointer ${isLoading ? 'hidden' : ''}`}
            loading="lazy"
            alt=""
            src={avatar || "/path/to/default-avatar.png"}
            onClick={handleAvatarClick}
            style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
          />
          <input
            id="avatar-upload"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleAvatarChange}
          />
        </div>
        <div className="flex flex-col items-start justify-start gap-4 w-full mt-4">
          {isEditing ? (
            <>
              <input
                className="w-full h-12 text-xl font-bold"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
              <textarea
                className="w-full h-32 text-lg text-gray-700"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </>
          ) : (
            <>
              <h1 className="w-full text-2xl font-bold">{nickname}</h1>
              <h3 className="w-full text-lg text-gray-700">
                <p>ID: {id}</p>
                <p>简介: {bio}</p>
                <p>邮箱: {email}</p>
              </h3>
            </>
          )}
          {currentUserId === parseInt(id) && (
            <button
              className="py-2 px-4 bg-red-500 text-white rounded-lg"
              onClick={handleEditClick}
            >
              {isEditing ? "完成" : "编辑"}
            </button>
          )}
        </div>
      </div>
      <style>{`
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
    </section>
  );
};

ProfileContent.propTypes = {
  className: PropTypes.string,
};

export default ProfileContent;
