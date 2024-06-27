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
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    // 获取当前登录用户的 ID
    axios.get(`http://106.52.158.123:5000/api/profile`, { withCredentials: true })
      .then(response => {
        setCurrentUserId(response.data.id);
      })
      .catch(error => {
        console.error("Error fetching current user profile:", error);
      });

    // 获取用户资料
    axios.get(`http://106.52.158.123:5000/api/basic_profile/${id}`, { withCredentials: true })
      .then(response => {
        setUserData(response.data);
        setNewUserData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching user profile:", error);
        setLoading(false);
      });

    // 获取用户的商品数据
    axios.get(`http://106.52.158.123:5000/api/user_products/${id}`, { withCredentials: true })
      .then(response => {
        // 按照 created_at 进行排序
        const sortedProducts = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setProducts(sortedProducts);
      })
      .catch(error => {
        console.error("Error fetching user products:", error);
      });
  }, [id]);

  useEffect(() => {
    console.log("Current User ID:", currentUserId);
    console.log("Profile ID:", id);
  }, [currentUserId, id]);

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

  const handleChatClick = () => {
    if (currentUserId) {
      window.location.href = 'http://106.52.158.123:3000/8';
    } else {
      window.location.href = 'http://106.52.158.123:3000/4';
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(products.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return <div style={spinnerStyle}>Loading...</div>;
  }

  if (!userData) {
    return <div>User profile not found</div>;
  }

  // 确保路径正确
  const avatarUrl = avatarPreview || (userData.avatar_file.startsWith('http') ? userData.avatar_file : `http://106.52.158.123:5000/${userData.avatar_file}`);
  const genderSymbol = newUserData.gender === 'male' ? '♂' : '♀';

  // 计算当前页显示的商品
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = products.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      {showAvatar && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75" onClick={handleCloseAvatar}>
          <img src={avatarUrl} alt="User avatar" className="object-cover w-1/2 h-1/2" />
        </div>
      )}
      <section
        className={`w-[90%] mx-auto flex flex-row items-start justify-between gap-10 max-w-full text-left text-45xl text-text-primary font-small-text mq750:gap-8 mq450:gap-4 mq1125:flex-wrap ${className}`}
      >
        <div className="flex flex-col items-start justify-start gap-6 min-w-[300px] max-w-full">
          <div className="relative w-full h-[437px] rounded-71xl max-w-full overflow-hidden shrink-0" onClick={handleAvatarClick} style={{ cursor: 'pointer' }}>
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
                  {currentUserId && currentUserId.toString() === id.toString() ? (
                    <button style={buttonStyle} onClick={handleEdit}>编辑</button>
                  ) : (
                    <button style={buttonStyle} onClick={handleChatClick}>聊一聊</button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex-1 flex flex-col items-start justify-start gap-6 max-w-full">
          <h1 className="m-0 self-stretch relative text-inherit tracking-[-0.02em] font-bold font-inherit text-32xl">
            发布过的
          </h1>
          <div className="self-stretch flex flex-row flex-wrap items-start justify-start gap-6 min-h-[554px]">
            {currentItems.map((product, i) => (
              <div key={i} className="w-[30%]"> {/* 宽度设为30%以确保每行三个 */}
                <ProductCard productId={product.id} /> {/* 传递 productId 属性 */}
              </div>
            ))}
          </div>
          <div className="self-stretch flex flex-row items-center justify-center py-0 px-5 box-border max-w-full text-base gap-4">
            <button
              className="bg-gray-200 text-gray-700 rounded-lg px-4 py-2"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              上一页
            </button>
            <span>{currentPage} / {Math.ceil(products.length / itemsPerPage)}</span>
            <button
              className="bg-gray-200 text-gray-700 rounded-lg px-4 py-2"
              onClick={handleNextPage}
              disabled={currentPage === Math.ceil(products.length / itemsPerPage)}
            >
              下一页
            </button>
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
