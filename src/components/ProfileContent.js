import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";

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
        const response = await axios.get(`http://106.52.158.123:5000/api/user_profiles/${id}`);
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
    <section className={`w-[1279px] flex flex-row items-end justify-start gap-[95px] max-w-full text-left text-45xl text-black font-small-text mq750:gap-[47px] mq450:gap-[24px] mq1125:flex-wrap ${className}`}>
      <div className="flex-1 flex flex-col items-start justify-end pt-0 px-0 pb-[23px] box-border max-w-full mq750:min-w-full">
        <div className="self-stretch flex flex-col items-start justify-start gap-[37px] max-w-full mq450:gap-[18px]">
          <h1 className="m-0 w-[624px] relative text-inherit tracking-[-0.02em] font-bold font-inherit inline-block max-w-full mq1050:text-32xl mq450:text-19xl">
            发布过的
          </h1>
          <div className="self-stretch flex flex-col items-end justify-start py-0 pr-[42px] pl-0 box-border gap-[31px] max-w-full text-xl mq1050:pr-[21px] mq1050:box-border mq450:gap-[15px]">
            <div className="self-stretch flex flex-row flex-wrap items-start justify-start gap-[30px] min-h-[554px]">
              {/* Replace the Card1 components with your actual components */}
            </div>
            <div className="w-[686px] flex flex-row items-start justify-center py-0 px-5 box-border max-w-full text-base">
              <div className="rounded-xl bg-whitesmoke overflow-x-auto flex flex-row items-start justify-start p-2 gap-[8px]">
                <div className="rounded-lg bg-whitesmoke flex flex-row items-start justify-start py-2 px-4">
                  <div className="relative leading-[150%] font-medium inline-block min-w-[48px] whitespace-nowrap">
                    上一页
                  </div>
                </div>
                <div className="w-[70px] rounded-lg bg-whitesmoke shrink-0 flex flex-row items-start justify-start py-2 px-4 box-border">
                  <div className="flex-1 relative leading-[150%] font-medium whitespace-nowrap">
                    ？/？
                  </div>
                </div>
                <div className="rounded-lg bg-whitesmoke flex flex-row items-start justify-start py-2 px-4">
                  <div className="relative leading-[150%] font-medium inline-block min-w-[48px] whitespace-nowrap">
                    下一页
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[421px] flex flex-col items-start justify-start gap-[31px] min-w-[421px] max-w-full mq750:min-w-full mq450:gap-[15px] mq1125:flex-1">
        <div className="relative w-full h-[437px]">
          {isLoading && <div className="loader"></div>}
          <img
            className={`self-stretch h-[437px] relative rounded-71xl max-w-full overflow-hidden shrink-0 object-cover cursor-pointer ${isLoading ? 'hidden' : ''}`}
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
        <div className="self-stretch flex flex-col items-start justify-start gap-[24px]">
          {isEditing ? (
            <>
              <input
                className="m-0 self-stretch h-[77px] relative text-inherit tracking-[-0.02em] font-bold font-inherit inline-block mq1050:text-32xl mq450:text-19xl"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
              <textarea
                className="m-0 self-stretch relative text-5xl leading-[150%] font-normal font-inherit text-gray mq450:text-lgi mq450:leading-[29px]"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </>
          ) : (
            <>
              <h1 className="m-0 self-stretch h-[77px] relative text-inherit tracking-[-0.02em] font-bold font-inherit inline-block mq1050:text-32xl mq450:text-19xl">
                {nickname}
              </h1>
              <h3 className="m-0 self-stretch relative text-5xl leading-[150%] font-normal font-inherit text-gray mq450:text-lgi mq450:leading-[29px]">
                <p className="m-0">ID: {id}</p>
                <p className="m-0">&nbsp;</p>
                <p className="m-0">简介: {bio}</p>
                <p className="m-0">&nbsp;</p>
                <p className="m-0">邮箱: {email}</p>
              </h3>
            </>
          )}
          {currentUserId === parseInt(id) && (
            <button
              className="rounded-lg bg-red-500 text-white py-2 px-4"
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
