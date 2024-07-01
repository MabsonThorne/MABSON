import React, { useEffect, useState, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cropper from 'react-easy-crop';
import imageCompression from 'browser-image-compression';
import getCroppedImg from './cropImage'; // Ensure you have this utility function
import ProductCard from "./ProductCard"; // Importing the ProductCard component

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
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const fileInputRef = useRef(null);
  const itemsPerPage = 8;
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    axios.get(`http://106.52.158.123:5000/api/profile`, { withCredentials: true })
      .then(response => {
        setCurrentUserId(response.data.id);
      })
      .catch(error => {
        console.error("Error fetching current user profile:", error);
      });

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

    axios.get(`http://106.52.158.123:5000/api/user_products/${id}`, { withCredentials: true })
      .then(response => {
        const sortedProducts = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setProducts(sortedProducts);
      })
      .catch(error => {
        console.error("Error fetching user products:", error);
      });
  }, [id]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setNewUserData(userData);
    setAvatarPreview(null);
    setShowCropper(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUserData({ ...newUserData, [name]: value });
  };

  const handleGenderChange = (gender) => {
    setNewUserData({ ...newUserData, gender });
  };

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
        setShowCropper(true);
      } catch (error) {
        console.error('Error compressing image:', error);
      }
    }
  };

  const handleCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropSubmit = useCallback(async () => {
    try {
      const croppedImageBlob = await getCroppedImg(
        URL.createObjectURL(avatar),
        croppedAreaPixels
      );
      setNewUserData({ ...newUserData, avatar_file: croppedImageBlob });
      const croppedImageUrl = URL.createObjectURL(croppedImageBlob);
      setAvatarPreview(croppedImageUrl);
      setShowCropper(false); // Close the cropper dialog
    } catch (e) {
      console.error('Failed to crop image', e);
    }
  }, [avatar, croppedAreaPixels, newUserData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    try {
      await axios.all([
        axios.put(`http://106.52.158.123:5000/api/users/${id}`, {
          username: newUserData.username,
          email: newUserData.email,
        }, {
          withCredentials: true
        }),
        axios.put(`http://106.52.158.123:5000/api/user_profiles/${id}`, formData, {
          withCredentials: true
        })
      ]);
      setUserData({ ...userData, ...newUserData });
      setEditing(false);
      setAvatarPreview(null);
      window.location.reload(); //立即刷新
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile: " + error.message);
    }
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
      navigate(`/chat/${currentUserId}`, { state: { contact_id: id } });
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

  const avatarUrl = avatarPreview || (typeof userData.avatar_file === 'string' && userData.avatar_file.startsWith('http') ? userData.avatar_file : `http://106.52.158.123:5000/${userData.avatar_file}`);
  const genderSymbol = newUserData.gender === 'male' ? '♂' : '♀';

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = products.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className={`profile-content-container ${className}`}>
      {showAvatar && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75" onClick={handleCloseAvatar}>
          <img src={avatarUrl} alt="User avatar" className="object-cover w-1/2 h-1/2" />
        </div>
      )}
      <section className="profile-info">
        <div className="flex flex-col items-start justify-start gap-6 w-full max-w-full">
          <div className="relative w-full h-[437px] rounded-71xl overflow-hidden shrink-0" onClick={handleAvatarClick} style={{ cursor: 'pointer' }}>
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
                ref={fileInputRef}
                style={{ display: 'none' }}
              />
            )}
          </div>
          <div className="self-stretch flex flex-col items-start justify-start gap-[24px] w-full">
            {editing ? (
              <>
                <input
                  type="text"
                  name="username"
                  value={newUserData.username}
                  onChange={handleChange}
                  className="m-0 self-stretch h-[77px] relative text-inherit tracking-[-0.02em] font-bold font-inherit inline-block mq1050:text-32xl mq450:text-19xl w-full"
                />
                <label className="m-0 self-stretch relative text-5xl leading-[150%] font-normal font-inherit text-gray-100 mq450:text-lgi mq450:leading-[29px] w-full">
                  简介:
                  <input
                    type="text"
                    name="bio"
                    value={newUserData.bio}
                    onChange={handleChange}
                    className="w-full"
                  />
                </label>
                <label className="m-0 self-stretch relative text-5xl leading-[150%] font-normal font-inherit text-gray-100 mq450:text-lgi mq450:leading-[29px] w-full">
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
                <label className="m-0 self-stretch relative text-5xl leading-[150%] font-normal font-inherit text-gray-100 mq450:text-lgi mq450:leading-[29px] w-full">
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
                <h1 className="m-0 self-stretch h-[77px] relative text-inherit tracking-[-0.02em] font-bold font-inherit inline-block mq1050:text-32xl mq450:text-19xl w-full">
                  {userData.username}
                </h1>
                <div className="m-0 self-stretch relative text-5xl leading-[150%] font-normal font-inherit text-gray-100 mq450:text-lgi mq450:leading-[29px] flex flex-col gap-4 w-full">
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
      </section>
      <section className="product-list">
        <h1 className="m-0 self-stretch relative text-inherit tracking-[-0.02em] font-bold font-inherit text-32xl w-full">
          发布过的
        </h1>
        <div className="self-stretch flex flex-row flex-wrap items-start justify-center gap-6 min-h-[554px] w-full">
          {currentItems.map((product, i) => (
            <div key={i} className="product-card">
              <ProductCard productId={product.id} />
            </div>
          ))}
        </div>
        <div className="self-stretch flex flex-row items-center justify-center py-0 px-5 box-border max-w-full text-base gap-4 w-full">
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
      </section>
      {showCropper && (
        <div className="cropper-modal">
          <div className="cropper-content">
            <button className="cropper-close-button" onClick={() => setShowCropper(false)}>X</button>
            <div className="cropper-left">
              <Cropper
                image={URL.createObjectURL(avatar)}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
                showGrid={true}
                style={{ containerStyle: { width: '100%', height: '100%' }, cropAreaStyle: { borderRadius: '8px' } }}
              />
            </div>
            <button
              className="cropper-complete-button py-2.5 px-4 text-white rounded-lg"
              onClick={handleCropSubmit}
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
              <b className="text-base font-semibold block">
                完成
              </b>
            </button>
          </div>
        </div>
      )}
      <style jsx>{`
        .profile-content-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          padding: 0 16px;
        }

        .profile-info {
          flex: 1;
          min-width: 300px;
          margin: 10px;
        }

        .product-list {
          flex: 2;
          min-width: 300px;
          margin: 10px;
        }

        .product-card {
          width: calc(25% - 24px);
          box-sizing: border-box;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          margin-top: 20px;
        }

        .pagination-button {
          background-color: #e0e0e0;
          border: none;
          padding: 10px;
          border-radius: 5px;
          cursor: pointer;
        }

        @media (max-width: 1024px) {
          .product-card {
            width: calc(33.33% - 24px);
          }
        }

        @media (max-width: 768px) {
          .product-card {
            width: calc(50% - 24px);
          }
        }

        @media (max-width: 480px) {
          .profile-info, .product-list {
            flex: 1 1 100%;
            margin: 0;
          }
          .product-card {
            width: calc(50% - 12px);
          }
        }

        .cropper-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .cropper-content {
          background: white;
          padding: 20px;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          width: 60%;
          height: 80%;
        }

        .cropper-left {
          flex: 1;
          position: relative;
          width: 100%;
          height: 70%;
          border-radius: 8px;
          overflow: hidden;
        }

        .cropper-close-button {
          position: absolute;
          top: 10px;
          right: 10px;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
        }

        .cropper-complete-button {
          margin-top: 20px;
          background-color: red;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 10px;
          cursor: pointer;
        }
      `}</style>
    </div>
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
  padding: "10px 90px",
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
