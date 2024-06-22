import React, { memo, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const FrameComponent2 = memo(({ className = "" }) => {
  const navigate = useNavigate();
  const [showGotong, setShowGotong] = useState(false);
  const [showText, setShowText] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkLoginStatus = useCallback(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

  const onButtonClick = useCallback(() => {
    if (isLoggedIn) {
      window.location.href = 'http://106.52.158.123:3000/6';
    } else {
      window.location.href = 'http://106.52.158.123:3000/4';
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const gotongTimer = setTimeout(() => {
      setShowGotong(true);
    }, 0); // 立即显示 GOTONG

    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 2000); // 在 GOTONG 动画结束后 2 秒显示 "购你所购，想你所想"

    const slideTimer = setInterval(() => {
      setSlideIndex((prevIndex) => (prevIndex + 1) % 3);
    }, 4000); // 每4秒切换一次幻灯片

    return () => {
      clearTimeout(gotongTimer);
      clearTimeout(textTimer);
      clearInterval(slideTimer);
    };
  }, []);

  return (
    <div
      className={`self-stretch flex flex-col items-end justify-start gap-[46px] max-w-full text-left text-29xl text-text-primary font-small-text mq750:gap-[23px] ${className}`}
    >
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes slideUpLoop {
            0% {
              transform: translateY(100%);
              opacity: 0;
            }
            25% {
              transform: translateY(0);
              opacity: 1;
            }
            75% {
              transform: translateY(0);
              opacity: 1;
            }
            100% {
              transform: translateY(100%);
              opacity: 0;
            }
          }

          @keyframes slideShow {
            0%, 25% { transform: translateX(0); }
            33%, 58% { transform: translateX(-100%); }
            66%, 91% { transform: translateX(-200%); }
            100% { transform: translateX(0); }
          }

          .fade-in {
            animation: fadeIn 2s forwards;
          }

          .slide-up-loop {
            animation: slideUpLoop 5s infinite;
          }

          .slideshow {
            display: flex;
            animation: slideShow 12s infinite;
          }

          .dot-container {
            position: absolute;
            bottom: 20px;
            right: 20px;
            display: flex;
            gap: 5px;
          }

          .dot {
            width: 10px;
            height: 10px;
            background-color: lightgray;
            border-radius: 50%;
            transition: background-color 0.3s;
          }

          .dot.active {
            background-color: darkgray;
          }

          .button-container {
            position: relative;
            z-index: 10; /* 确保在顶层 */
          }

          .button-text {
            position: relative;
            z-index: 20; /* 确保在按钮上面 */
          }

          .header-image {
            background-image: url('/image-1@2x.png'); /* 确保路径正确 */
            background-size: cover;
            background-position: center;
          }

          .header-image2 {
            background-image: url('/header-with-image@3x.png'); /* 确保路径正确 */
            background-size: cover;
            background-position: center;
          }

          .header-image3 {
            background-image: url('/image-11@2x.png'); /* 确保路径正确 */
            background-size: cover;
            background-position: center;
          }

          .red-text {
            color: red;
          }

          .red-button {
            background-color: red;
            color: white;
          }
        `}
      </style>
      <div className="self-stretch flex flex-row items-start justify-end py-0 pr-[11px] pl-0 box-border max-w-full text-center text-45xl text-red-200 relative">
        <div className="flex-1 rounded-lg overflow-hidden flex flex-col items-center justify-start py-48 pr-5 pl-[30px] box-border gap-[24px] max-w-full mq750:pt-[125px] mq750:pb-[125px] mq750:box-border relative">
          <div className="absolute inset-0 overflow-hidden">
            <div className="slideshow w-full h-full">
              <div className="w-full h-full flex-shrink-0 bg-cover bg-no-repeat header-image"></div>
              <div className="w-full h-full flex-shrink-0 bg-cover bg-no-repeat header-image2"></div>
              <div className="w-full h-full flex-shrink-0 bg-cover bg-no-repeat header-image3"></div>
            </div>
          </div>
          <div className="dot-container">
            <div className={`dot ${slideIndex === 0 ? "active" : ""}`}></div>
            <div className={`dot ${slideIndex === 1 ? "active" : ""}`}></div>
            <div className={`dot ${slideIndex === 2 ? "active" : ""}`}></div>
          </div>
          <h1
            className={`m-0 w-[841px] h-[77px] relative text-inherit tracking-[-0.02em] font-bold font-inherit inline-block [filter:drop-shadow(0px_4px_4px_rgba(0,_0,_0,_0.25))] max-w-full mq1050:text-32xl mq450:text-19xl ${
              showGotong ? "fade-in" : ""
            }`}
            style={{ opacity: showGotong ? 1 : 0 }}
          >
            <span className="red-text">GO</span>
            <span className="text-white">TONG</span>
          </h1>
          <div
            className={`w-[841px] relative text-5xl leading-[150%] text-white flex items-center justify-center max-w-full mq450:text-lgi mq450:leading-[29px] ${
              showText ? "slide-up-loop" : ""
            }`}
            style={{ opacity: showText ? 1 : 0 }}
          >
            购你所购，想你所想
          </div>
          <div className="w-[841px] flex flex-row items-start justify-center max-w-full button-container">
            <button
              className="cursor-pointer [border:none] py-3.5 px-6 red-button shadow-[0px_1px_2px_rgba(0,_0,_0,_0.05)] rounded-lg flex flex-row items-start justify-start hover:bg-red-100"
              onClick={onButtonClick}
            >
              <b className="relative text-base leading-[150%] font-semibold font-small-text text-white text-left button-text">
                {isLoggedIn ? "发布" : "登录"}
              </b>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

FrameComponent2.propTypes = {
  className: PropTypes.string,
};

export default FrameComponent2;
