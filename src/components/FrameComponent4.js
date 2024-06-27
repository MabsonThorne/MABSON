import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";
import Cookies from "js-cookie";

const FrameComponent4 = ({ className = "" }) => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = Cookies.get('authToken');
        if (!token) return;

        const response = await axios.get('http://106.52.158.123:5000/api/profile', { 
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        });
        setUserProfile(response.data);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        handleInvalidToken();
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleInvalidToken = useCallback(() => {
    Cookies.remove("authToken");
    setIsLoggedIn(false);
  }, []);

  const onHomeClick = useCallback(() => {
    window.location.href = "http://106.52.158.123:3000";
  }, []);

  const onTextClick = useCallback(() => {
    navigate("/1");
  }, [navigate]);

  const onTextClick1 = useCallback(() => {
    navigate("/2");
  }, [navigate]);

  const onButtonContainerClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const onButtonContainerClick1 = useCallback(() => {
    if (isLoggedIn) {
      navigate("/7");
    } else {
      navigate("/4");
    }
  }, [isLoggedIn, navigate]);

  const onLogoutClick = useCallback(() => {
    Cookies.remove("authToken");
    setIsLoggedIn(false);
    navigate("/4");
  }, [navigate]);

  const onAvatarClick = useCallback(() => {
    if (userProfile?.id) {
      navigate(`/3/${userProfile.id}`);
    }
  }, [navigate, userProfile]);
  
  return (
    <header className={`w-full flex flex-wrap items-center justify-between py-4 px-4 box-border text-left text-29xl text-red font-small-text ${className}`}>
      <div className="flex flex-row items-center gap-5 header-group">
        <img className="h-24 w-48 object-cover" loading="lazy" alt="Logo" src="/logo1-1@2x.png" />
        <h1 className="m-0 text-inherit leading-6 font-medium">
          <span className="text-red">GO</span>
          <span className="text-black">TONG</span>
        </h1>
      </div>
      <div className="flex flex-row items-center justify-center gap-6 header-group">
        <div className="flex items-center">
          <h1 className="m-0 text-xl leading-6 font-medium cursor-pointer" onClick={onHomeClick} style={{ color: 'black' }}>
            首页
          </h1>
        </div>
        <div className="flex items-center">
          <h1 className="m-0 text-xl leading-6 font-medium cursor-pointer" onClick={onTextClick} style={{ color: 'black' }}>
            采购端
          </h1>
        </div>
        <div className="flex items-center">
          <h1 className="m-0 text-xl leading-6 font-medium cursor-pointer" onClick={onTextClick1} style={{ color: 'black' }}>
            需求端
          </h1>
        </div>
      </div>
      <div className="flex flex-row items-center justify-end gap-5 text-base header-group">
        <div className="shadow-none rounded-lg bg-red flex items-center justify-center py-2.5 px-8 cursor-pointer hover:shadow-md" onClick={onButtonContainerClick}>
          <div className="text-white">消息</div>
        </div>
        {isLoggedIn ? (
          <>
            <div className="shadow-none rounded-lg bg-red flex items-center justify-center py-2.5 px-8 cursor-pointer hover:shadow-md" onClick={onLogoutClick}>
              <div className="text-white">登出</div>
            </div>
            <div className="flex items-center justify-start pt-1.5 relative">
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="loader"></div>
                </div>
              )}
              <button
                className={`h-16 w-16 rounded-full overflow-hidden focus:outline-none ${loading ? 'opacity-50' : 'opacity-100'} transition-shadow duration-300`}
                onClick={onAvatarClick}
                disabled={loading}
                style={{ boxShadow: '0px 0px 15px rgba(0,0,0,0.3)' }}
              >
                <img
                  className="w-full h-full object-cover"
                  src={userProfile?.avatar_file ? `http://106.52.158.123:5000/${userProfile.avatar_file}` : "/path/to/default-avatar.png"}
                  alt="User Avatar"
                />
              </button>
            </div>
          </>
        ) : (
          <div className="shadow-none rounded-lg bg-red flex items-center justify-center py-2.5 px-8 cursor-pointer hover:shadow-md" onClick={onButtonContainerClick1}>
            <div className="text-white">个人</div>
          </div>
        )}
      </div>
      <style>{`
        .loader {
          border: 4px solid #f3f3f3;
          border-top: 4px solid red;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .flex-wrap {
            flex-wrap: wrap;
          }
          .header-group {
            width: 100%;
            justify-content: center;
            margin-bottom: 16px;
          }
          .header-group:last-child {
            margin-bottom: 0;
          }
        }
      `}</style>
    </header>
  );
};

FrameComponent4.propTypes = {
  className: PropTypes.string,
};

export default FrameComponent4;
