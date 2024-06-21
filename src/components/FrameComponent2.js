import { useCallback } from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const FrameComponent2 = ({ className = "" }) => {
  const navigate = useNavigate();

  const onButtonClick1 = useCallback(() => {
    navigate("/4");
  }, [navigate]);

  return (
    <div
      className={`self-stretch flex flex-col items-end justify-start gap-[46px] max-w-full text-center text-45xl text-red font-small-text mq750:gap-[23px] ${className}`}
    >
      <header className="w-[1180px] flex flex-row items-center justify-between gap-[20px] max-w-full text-left text-29xl text-red font-small-text">
        <div className="flex flex-row items-center justify-between w-full">
          <div className="flex flex-row items-center justify-start">
            <img
              className="h-[98px] w-[202px] absolute !m-[0] top-[calc(50%_-_49px)] left-[-149px] object-cover z-[1]"
              loading="lazy"
              alt=""
              src="/logo1-1@2x.png"
            />
          </div>
        </div>
      </header>
      <div className="self-stretch flex flex-row items-center justify-end py-0 pr-1 pl-0 box-border max-w-full">
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
