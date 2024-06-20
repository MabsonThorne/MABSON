import { useCallback } from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const FrameComponent2 = ({ className = "" }) => {
  const navigate = useNavigate();

  const onTextClick = useCallback(() => {
    // Please sync "采购端" to the project
  }, []);

  const onTextClick1 = useCallback(() => {
    // Please sync "需求端" to the project
  }, []);

  const onButtonClick = useCallback(() => {
    // Please sync "消息" to the project
  }, []);

  const onButtonContainerClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const onButtonClick1 = useCallback(() => {
    navigate("/1");
  }, [navigate]);

  return (
    <div
      className={`self-stretch flex flex-col items-end justify-start gap-[46px] max-w-full text-center text-45xl text-red font-small-text mq750:gap-[23px] ${className}`}
    >
      <header className="w-[1180px] flex flex-row items-start justify-between gap-[20px] max-w-full text-left text-29xl text-red font-small-text">
        <div className="w-[210px] flex flex-row items-start justify-start relative">
          <h1 className="m-0 flex-1 relative text-inherit leading-[150%] font-medium font-inherit whitespace-nowrap">
            <span>GO</span>
            <span className="text-black">TONG</span>
          </h1>
          <img
            className="h-[98px] w-[202px] absolute !m-[0] top-[calc(50%_-_49px)] left-[-149px] object-cover z-[1]"
            loading="lazy"
            alt=""
            src="/logo1-1@2x.png"
          />
        </div>
        <div className="flex flex-col items-start justify-start pt-2.5 px-0 pb-0 box-border max-w-full text-13xl text-black">
          <div className="flex flex-row items-start justify-start gap-[48px] max-w-full mq450:gap-[24px]">
            <div className="flex flex-col items-start justify-start pt-0.5 px-0 pb-0">
              <h2 className="m-0 relative text-inherit leading-[150%] font-medium font-inherit inline-block min-w-[64px]">
                首页
              </h2>
            </div>
            <div className="w-[307px] flex flex-col items-start justify-start pt-0.5 px-0 pb-0 box-border mq1050:w-[67px]">
              <div className="w-60 flex flex-row items-start justify-between gap-[20px] mq1050:hidden">
                <h2
                  className="m-0 relative text-inherit leading-[150%] font-medium font-inherit inline-block min-w-[96px] cursor-pointer"
                  onClick={onTextClick}
                >
                  采购端
                </h2>
                <h2
                  className="m-0 relative text-inherit leading-[150%] font-medium font-inherit inline-block min-w-[96px] cursor-pointer"
                  onClick={onTextClick1}
                >
                  需求端
                </h2>
              </div>
            </div>
            <div className="w-[348px] flex flex-row items-start justify-between max-w-full gap-[20px] text-base mq450:hidden">
              <Button
                className="h-[52px] w-[106px] shadow-[0px_1px_2px_rgba(0,_0,_0,_0.05)] cursor-pointer"
                variant="contained"
                sx={{
                  textTransform: "none",
                  color: "#000",
                  fontSize: "16",
                  background: "#ff0000",
                  borderRadius: "8px",
                  "&:hover": { background: "#ff0000" },
                  width: 106,
                  height: 52,
                }}
                onClick={onButtonClick}
              >
                消息
              </Button>
              <div
                className="shadow-[0px_1px_2px_rgba(0,_0,_0,_0.05)] rounded-lg bg-red flex flex-row items-start justify-start py-3.5 px-6 cursor-pointer"
                onClick={onButtonContainerClick}
              >
                <div className="relative leading-[150%] font-medium inline-block min-w-[32px]">
                  个人
                </div>
              </div>
              <div className="w-[72px] flex flex-col items-start justify-start pt-1.5 px-0 pb-0 box-border">
                <select className="self-stretch h-10 bg-[transparent] [border:none] flex flex-row items-start justify-start">
                  <option value="option_1">Option 1</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="self-stretch flex flex-row items-start justify-end py-0 pr-1 pl-0 box-border max-w-full">
        <div className="flex-1 rounded-lg overflow-hidden flex flex-col items-center justify-start py-48 pr-5 pl-[30px] box-border gap-[24px] bg-[url('/public/header-with-image@3x.png')] bg-cover bg-no-repeat bg-[top] max-w-full mq750:pt-[125px] mq750:pb-[125px] mq750:box-border">
          <h1 className="m-0 w-[841px] relative text-inherit tracking-[-0.02em] font-bold font-inherit inline-block [filter:drop-shadow(0px_4px_4px_rgba(0,_0,_0,_0.25))] max-w-full mq450:text-19xl mq1000:text-32xl">
            <span>GO</span>
            <span className="text-white">TONG</span>
          </h1>
          <div className="w-[841px] relative text-5xl leading-[150%] text-white flex items-center justify-center max-w-full mq450:text-lgi mq450:leading-[29px]">
            购你所购，想你所想
          </div>
          <div className="w-[841px] h-[52px] flex flex-row items-start justify-center max-w-full">
            <Button
              className="self-stretch w-20 shadow-[0px_1px_2px_rgba(0,_0,_0,_0.05)] cursor-pointer"
              variant="contained"
              sx={{
                textTransform: "none",
                color: "#fff",
                fontSize: "16",
                background: "#ff0000",
                borderRadius: "8px",
                "&:hover": { background: "#ff0000" },
                width: 80,
              }}
              onClick={onButtonClick1}
            >
              登录
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

FrameComponent2.propTypes = {
  className: PropTypes.string,
};

export default FrameComponent2;
