import { useCallback, useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const FrameComponent2 = ({ className = "" }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = ["/image1.png", "/image2.png", "/image3.png"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const onTextClick = useCallback(() => {
    // Navigate to "采购端"
  }, []);

  const onTextClick1 = useCallback(() => {
    // Navigate to "需求端"
  }, []);

  const onButtonClick = useCallback(() => {
    // Navigate to "消息"
  }, []);

  const onButtonContainerClick = useCallback(() => {
    if (isLoggedIn) {
      navigate("/3");
    } else {
      navigate("/4");
    }
  }, [isLoggedIn, navigate]);

  const onButtonClick1 = useCallback(() => {
    if (isLoggedIn) {
      navigate("/1");
    } else {
      navigate("/4");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    // 假设有一个函数 `checkLoginStatus` 用于检查用户是否登录
    const checkLoginStatus = () => {
      // 这里应该有一个实际的登录状态检查逻辑
      setIsLoggedIn(true); // 根据实际登录状态设置
    };
    checkLoginStatus();
  }, []);

  return (
    <div className={`flex flex-col items-end justify-start gap-12 max-w-full text-center text-5xl text-red font-medium ${className}`}>
      <header className="w-full flex flex-row items-start justify-between gap-5 text-left text-3xl text-red font-medium">
        <div className="relative flex items-start justify-start">
          <h1 className="m-0 relative text-inherit leading-[150%] font-medium font-inherit whitespace-nowrap">
            <span>GO</span><span className="text-black">TONG</span>
          </h1>
          <img className="h-24 w-24 absolute top-1/2 left-[-6rem] transform -translate-y-1/2 object-cover z-1" loading="lazy" alt="" src="/logo1-1@2x.png" />
        </div>
        <div className="flex flex-col items-start justify-start gap-5 text-lg text-black">
          <div className="flex flex-row items-start justify-start gap-12">
            <h2 className="cursor-pointer" onClick={onTextClick}>采购端</h2>
            <h2 className="cursor-pointer" onClick={onTextClick1}>需求端</h2>
          </div>
          <div className="flex flex-row items-start justify-between gap-5 text-base">
            <Button variant="contained" sx={{ textTransform: "none", color: "#000", fontSize: "16", background: "#ff0000", borderRadius: "8px", "&:hover": { background: "#ff0000" } }} onClick={onButtonClick}>
              消息
            </Button>
            <div className="rounded-lg bg-red flex items-start justify-start py-2 px-6 cursor-pointer" onClick={onButtonContainerClick}>
              <div className="font-medium">个人</div>
            </div>
            <select className="bg-transparent border-none flex items-start justify-start">
              <option value="option_1">Option 1</option>
            </select>
          </div>
        </div>
      </header>
      <div className="relative flex items-center justify-center bg-cover bg-no-repeat" style={{ backgroundImage: `url(${slides[currentSlide]})`, height: "500px" }}>
        <h1 className="absolute top-10 left-10 text-white text-5xl font-bold">GO<span className="text-red">TONG</span></h1>
        <div className="absolute bottom-10 left-10 text-white text-xl">购你所购，想你所想</div>
        <Button className="absolute bottom-10 right-10" variant="contained" sx={{ textTransform: "none", color: "#fff", fontSize: "16", background: "#ff0000", borderRadius: "8px", "&:hover": { background: "#ff0000" } }} onClick={onButtonClick1}>
          {isLoggedIn ? "发布" : "登录"}
        </Button>
        <div className="absolute bottom-10 right-10 flex gap-2">
          {slides.map((_, index) => (
            <span key={index} className={`h-2 w-2 rounded-full ${currentSlide === index ? 'bg-red' : 'bg-gray-300'}`}></span>
          ))}
        </div>
      </div>
    </div>
  );
};

FrameComponent2.propTypes = {
  className: PropTypes.string,
};

export default FrameComponent2;
