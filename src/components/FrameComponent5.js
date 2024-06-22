import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";

const FrameComponent5 = ({ className = "" }) => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`http://106.52.158.123:5000/api/profile/${userId}`);
        setUserProfile(response.data);
        setBio(response.data.bio || "");
        setEmail(response.data.email);
        setGender(response.data.gender || "");
        setAvatarPreview(response.data.avatar_file);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const onAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const onButtonContainerClick = useCallback(async () => {
    try {
      const formData = new FormData();
      formData.append('bio', bio);
      formData.append('gender', gender);
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      await axios.put(`http://106.52.158.123:5000/api/profile/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate('/');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  }, [bio, gender, avatarFile, userId, navigate]);

  return (
    <div
      className={`w-[1171px] flex flex-row items-start justify-center gap-[87px] max-w-full text-left text-181xl text-darkgray font-small-text lg:flex-wrap lg:gap-[43px] mq750:gap-[22px] ${className}`}
    >
      <div className="flex-[0.925] rounded-xl bg-gainsboro-100 overflow-hidden flex flex-row items-start justify-center py-[142px] pr-5 pl-[21px] box-border min-w-[356px] min-h-[613px] max-w-full lg:flex-1 lg:min-h-[auto] mq750:pt-[92px] mq750:pb-[92px] mq750:box-border mq750:min-w-full">
        <div className="flex flex-col items-center">
          {avatarPreview ? (
            <img src={avatarPreview} alt="Avatar Preview" className="w-24 h-24 rounded-full object-cover" />
          ) : (
            <h1 className="m-0 relative text-inherit leading-[150%] font-medium font-inherit">+</h1>
          )}
          <input type="file" accept="image/*" onChange={onAvatarChange} className="mt-2" />
        </div>
      </div>
      <div className="flex-1 flex flex-col items-start justify-start pt-[86px] px-0 pb-0 box-border min-w-[349px] max-w-full text-21xl text-gray-100 lg:flex-1 mq750:pt-14 mq750:box-border mq750:min-w-full">
        <div className="self-stretch flex flex-col items-start justify-start gap-[118px] max-w-full mq750:gap-[59px] mq450:gap-[29px]">
          <div className="self-stretch flex flex-row items-start justify-start py-0 pr-0 pl-[22px] box-border max-w-full">
            <div className="flex-1 flex flex-col items-start justify-start gap-[24px] max-w-full">
              <h1 className="m-0 self-stretch relative text-inherit leading-[110%] font-semibold font-inherit text-text-primary mq1050:text-13xl mq1050:leading-[35px] mq450:text-5xl mq450:leading-[26px]">
                {userProfile?.username || "用户名称"}
              </h1>
              <textarea
                className="m-0 self-stretch relative text-5xl leading-[150%] font-normal font-inherit mq450:text-lgi mq450:leading-[29px]"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="简介"
              />
              <div className="self-stretch h-[60px] relative text-xl leading-[150%] font-medium flex items-center mq450:text-base mq450:leading-[24px]">
                <span className="[line-break:anywhere]">
                  <p className="m-0">{email}</p>
                </span>
              </div>
              <div className="self-stretch h-[60px] relative text-xl leading-[150%] font-medium flex items-center mq450:text-base mq450:leading-[24px]">
                <label>性别：</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option value="male">男</option>
                  <option value="female">女</option>
                  <option value="other">其他</option>
                </select>
              </div>
            </div>
          </div>
          <div
            className="w-[515px] shadow-[0px_1px_2px_rgba(0,_0,_0,_0.05)] rounded-lg bg-red flex flex-row items-start justify-center py-3.5 px-5 box-border max-w-full cursor-pointer text-17xl text-white"
            onClick={onButtonContainerClick}
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
