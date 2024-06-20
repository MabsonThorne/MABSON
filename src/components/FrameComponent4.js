import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const FrameComponent4 = ({ className = "" }) => {
  const navigate = useNavigate();

  const onTextClick = useCallback(() => {
    // Please sync "采购端" to the project
  }, []);

  const onTextClick1 = useCallback(() => {
    // Please sync "需求端" to the project
  }, []);

  const onButtonContainerClick = useCallback(() => {
    // Please sync "消息" to the project
  }, []);

  const onButtonContainerClick1 = useCallback(() => {
    navigate("/");
  }, [navigate]);

  return (
    <header
      className={`w-[1182px] flex flex-row items-start justify-end py-0 px-px box-border max-w-full text-left text-29xl text-red font-small-text ${className}`}
    >
      <div className="flex-1 flex flex-row items-start justify-between max-w-full gap-[20px]">
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
        <div className="w-[815px] flex flex-col items-start justify-start pt-2.5 px-0 pb-0 box-border max-w-full text-13xl text-black">
          <div className="self-stretch flex flex-row items-start justify-start gap-[48px] max-w-full mq450:gap-[24px]">
            <div className="flex flex-col items-start justify-start pt-0.5 px-0 pb-0">
              <h1 className="m-0 relative text-inherit leading-[150%] font-medium font-inherit inline-block min-w-[64px]">
                首页
              </h1>
            </div>
            <div className="w-[307px] flex flex-col items-start justify-start pt-0.5 px-0 pb-0 box-border">
              <div className="w-60 flex flex-row items-start justify-between gap-[20px]">
                <h1
                  className="m-0 relative text-inherit leading-[150%] font-medium font-inherit inline-block min-w-[96px] cursor-pointer"
                  onClick={onTextClick}
                >
                  采购端
                </h1>
                <h1
                  className="m-0 relative text-inherit leading-[150%] font-medium font-inherit inline-block min-w-[96px] cursor-pointer"
                  onClick={onTextClick1}
                >
                  需求端
                </h1>
              </div>
            </div>
            <div className="w-[348px] flex flex-row items-start justify-between max-w-full gap-[20px] text-base mq1050:hidden">
              <div
                className="shadow-[0px_1px_2px_rgba(0,_0,_0,_0.05)] rounded-lg bg-red flex flex-row items-start justify-start py-3.5 px-[37px] cursor-pointer"
                onClick={onButtonContainerClick}
              >
                <div className="relative leading-[150%] font-medium inline-block min-w-[32px]">
                  消息
                </div>
              </div>
              <div
                className="shadow-[0px_1px_2px_rgba(0,_0,_0,_0.05)] rounded-lg bg-red flex flex-row items-start justify-start py-3.5 px-6 cursor-pointer"
                onClick={onButtonContainerClick1}
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
      </div>
    </header>
  );
};

FrameComponent4.propTypes = {
  className: PropTypes.string,
};

export default FrameComponent4;
