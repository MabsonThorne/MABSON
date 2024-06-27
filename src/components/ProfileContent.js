import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import ProductCard from "./ProductCard";

const ProfileContent = ({ className = "", id }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [newUserData, setNewUserData] = useState({});
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showAvatar, setShowAvatar] = useState(false);

  useEffect(() => {
    if (!id) {
      console.error("User ID is required");
      setLoading(false);
      return;
    }

    // 获取当前登录用户的 ID
    axios.get(`http://106.52.158.123:5000/api/profile`, { withCredentials: true })
      .then(response => {
        console.log("Current User ID:", response.data.id);
        setCurrentUserId(response.data.id);
      })
      .catch(error => {
        console.error("Error fetching current user profile:", error);
      });

    // 获取用户资料
    axios.get(`http://106.52.158.123:5000/api/basic_profile/${id}`, { withCredentials: true })
      .then(response => {
        console.log("Profile User ID:", id);
        setUserData(response.data);
        setNewUserData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching user profile:", error);
        setLoading(false);
      });
  }, [id]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setNewUserData(userData); // 取消时恢复原数据
    setAvatarPreview(null); // 清除头像预览
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUserData({ ...newUserData, [name]: value });
  };

  const handleGenderChange = (gender) => {
    setNewUserData({ ...newUserData, gender });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setNewUserData({ ...newUserData, avatar_file: file });

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (
      newUserData.username === userData.username &&
      newUserData.email === userData.email &&
      newUserData.bio === userData.bio &&
      newUserData.gender === userData.gender &&
      !newUserData.avatar_file
    ) {
      setEditing(false);
      return;
    }

    const formData = new FormData();
    formData.append('username', newUserData.username);
    formData.append('email', newUserData.email);
    formData.append('bio', newUserData.bio);
    formData.append('gender', newUserData.gender);
    if (newUserData.avatar_file) {
      formData.append('avatar_file', newUserData.avatar_file);
    }

    axios.all([
      axios.put(`http://106.52.158.123:5000/api/users/${id}`, {
        username: newUserData.username,
        email: newUserData.email,
      }, {
        withCredentials: true
      }),
      axios.put(`http://106.52.158.123:5000/api/user_profiles/${id}`, formData, {
        withCredentials: true
      })
    ])
    .then(() => {
      setUserData({ ...userData, ...newUserData });
      setEditing(false);
      setAvatarPreview(null); // 清除头像预览
      window.location.reload(); // 刷新页面
    })
    .catch(error => {
      console.error("Error updating profile:", error);
    });
  };

  const handleAvatarClick = () => {
    if (!editing) {
      setShowAvatar(true);
    }
  };

  const handleCloseAvatar = () => {
    setShowAvatar(false);
  };

  if (loading) {
    return <div style={spinnerStyle}>Loading...</div>;
  }

  if (!userData) {
    return <div>User profile not found</div>;
  }

  const avatarUrl = avatarPreview || `http://106.52.158.123:5000/${userData.avatar_file}`;
  const genderSymbol = newUserData.gender === 'male' ? '♂' : '♀';

  return (
    <>
      {showAvatar && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75" onClick={handleCloseAvatar}>
          <img src={avatarUrl} alt="User avatar" className="object-cover w-1/2 h-1/2" />
        </div>
      )}
      <section
        className={`w-[1279px] flex flex-row items-end justify-start gap-[95px] max-w-full text-left text-45xl text-text-primary font-small-text mq750:gap-[47px] mq450:gap-[24px] mq1125:flex-wrap ${className}`}
      >
        <div className="flex-1 flex flex-col items-start justify-end pt-0 px-0 pb-[23px] box-border max-w-full mq750:min-w-full">
          <div className="self-stretch flex flex-col items-start justify-start gap-[37px] max-w-full mq450:gap-[18px]">
            <h1 className="m-0 w-[624px] relative text-inherit tracking-[-0.02em] font-bold font-inherit inline-block max-w-full mq1050:text-32xl mq450:text-19xl">
              发布过的
            </h1>
            <div className="self-stretch flex flex-row flex-wrap items-start justify-start gap-[30px] min-h-[554px]">
              {Array(6).fill().map((_, i) => (
                <div key={i} className="w-[30%]"> {/* 宽度设为30%以确保每行三个 */}
                  <ProductCard />
                </div>
              ))}
            </div>
            <div className="self-stretch flex flex-row items-center justify-center py-0 px-5 box-border max-w-full text-base gap-[20px]">
              <button className="bg-gray-200 text-gray-700 rounded-lg px-4 py-2">上一页</button>
              <button className="bg-gray-200 text-gray-700 rounded-lg px-4 py-2">下一页</button>
            </div>
          </div>
        </div>
        <div className="w-[421px] flex flex-col items-start justify-start gap-[31px] min-w-[421px] max-w-full mq750:min-w-full mq450:gap-[15px] mq1125:flex-1">
          <div className="relative self-stretch h-[437px] rounded-71xl max-w-full overflow-hidden shrink-0" onClick={handleAvatarClick} style={{ cursor: 'pointer' }}>
            <label htmlFor="avatar-upload" style={{ cursor: editing ? 'pointer' : 'default' }}>
              <img
                className="object-cover w-full h-full"
                loading="lazy"
                alt="User avatar"
                src={avatarUrl}
                style={{ opacity: editing ? 0.5 : 1 }}
              />
              {editing && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white bg-black bg-opacity-50 p-2 rounded">点击上传新头像</span>
                </div>
              )}
            </label>
            {editing && (
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
              />
            )}
          </div>
          <div className="self-stretch flex flex-col items-start justify-start gap-[24px]">
            {editing ? (
              <>
                <input
                  type="text"
                  name="username"
                  value={newUserData.username}
                  onChange={handleChange}
                  className="m-0 self-stretch h-[77px] relative text-inherit tracking-[-0.02em] font-bold font-inherit inline-block mq1050:text-32xl mq450:text-19xl"
                />
                <label className="m-0 self-stretch relative text-5xl leading-[150%] font-normal font-inherit text-gray-100 mq450:text-lgi mq450:leading-[29px]">
                  简介:
                  <input
                    type="text"
                    name="bio"
                    value={newUserData.bio}
                    onChange={handleChange}
                    className="w-full"
                  />
                </label>
                <label className="m-0 self-stretch relative text-5xl leading-[150%] font-normal font-inherit text-gray-100 mq450:text-lgi mq450:leading-[29px]">
                  性别:
                  <div className="flex gap-2">
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={newUserData.gender === "male"}
                        onChange={() => handleGenderChange("male")}
                      />
                      男
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={newUserData.gender === "female"}
                        onChange={() => handleGenderChange("female")}
                      />
                      女
                    </label>
                  </div>
                </label>
                <label className="m-0 self-stretch relative text-5xl leading-[150%] font-normal font-inherit text-gray-100 mq450:text-lgi mq450:leading-[29px]">
                  邮箱:
                  <input
                    type="text"
                    name="email"
                    value={newUserData.email}
                    onChange={handleChange}
                    className="w-full"
                  />
                </label>
                <div className="flex justify-between w-full gap-2">
                  <button style={smallButtonStyle} onClick={handleCancel}>取消</button>
                  <button style={smallButtonStyle} onClick={handleSubmit}>完成</button>
                </div>
              </>
            ) : (
              <>
                <h1 className="m-0 self-stretch h-[77px] relative text-inherit tracking-[-0.02em] font-bold font-inherit inline-block mq1050:text-32xl mq450:text-19xl">
                  {userData.username}
                </h1>
                <div className="m-0 self-stretch relative text-5xl leading-[150%] font-normal font-inherit text-gray-100 mq450:text-lgi mq450:leading-[29px] flex flex-col gap-4">
                  <p className="m-0">ID: {userData.id}</p>
                  <p className="m-0">简介: {userData.bio}</p>
                  <p className="m-0">性别: {genderSymbol}</p>
                  <p className="m-0">邮箱: {userData.email}</p>
                  {currentUserId == id && ( // 检查类型是否匹配
                    <button style={buttonStyle} onClick={handleEdit}>编辑</button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

const spinnerStyle = {
  border: "8px solid #f3f3f3",
  borderTop: "8px solid red",
  borderRadius: "50%",
  width: "60px",
  height: "60px",
  animation: "spin 2s linear infinite",
  margin: "auto",
};

const buttonStyle = {
  backgroundColor: "red",
  color: "white",
  border: "none",
  padding: "10px 90px", // 调整按钮长度
  fontSize: "16px",
  cursor: "pointer",
  borderRadius: "5px",
  width: "100%",
};

const smallButtonStyle = {
  backgroundColor: "red",
  color: "white",
  border: "none",
  padding: "10px 20px",
  fontSize: "16px",
  cursor: "pointer",
  borderRadius: "5px",
  flex: 1,
  textAlign: "center",
};

// 将CSS样式添加到页面的style标签中
const spinnerKeyframes = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = spinnerKeyframes;
document.head.appendChild(styleSheet);

ProfileContent.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
};

export default ProfileContent;
