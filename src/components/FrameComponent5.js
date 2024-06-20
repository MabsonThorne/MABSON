import { useCallback } from "react";
import PropTypes from "prop-types";

const FrameComponent5 = ({ className = "" }) => {
  const onButtonContainerClick = useCallback(() => {
    // Please sync "消息" to the project
  }, []);

  return (
    <div
      className={`w-[1171px] flex flex-row items-start justify-center gap-[87px] max-w-full text-left text-181xl text-darkgray font-small-text lg:flex-wrap lg:gap-[43px] mq750:gap-[22px] ${className}`}
    >
      <div className="flex-[0.925] rounded-xl bg-gainsboro-100 overflow-hidden flex flex-row items-start justify-center py-[142px] pr-5 pl-[21px] box-border min-w-[356px] min-h-[613px] max-w-full lg:flex-1 lg:min-h-[auto] mq750:pt-[92px] mq750:pb-[92px] mq750:box-border mq750:min-w-full">
        <h1 className="m-0 w-[134px] relative text-inherit leading-[150%] font-medium font-inherit flex items-center mq1050:text-61xl mq1050:leading-[180px] mq450:text-31xl mq450:leading-[120px]">
          +
        </h1>
      </div>
      <div className="flex-1 flex flex-col items-start justify-start pt-[86px] px-0 pb-0 box-border min-w-[349px] max-w-full text-21xl text-gray lg:flex-1 mq750:pt-14 mq750:box-border mq750:min-w-full">
        <div className="self-stretch flex flex-col items-start justify-start gap-[118px] max-w-full mq750:gap-[59px] mq450:gap-[29px]">
          <div className="self-stretch flex flex-row items-start justify-start py-0 pr-0 pl-[22px] box-border max-w-full">
            <div className="flex-1 flex flex-col items-start justify-start gap-[24px] max-w-full">
              <h1 className="m-0 self-stretch relative text-inherit leading-[110%] font-semibold font-inherit text-black mq1050:text-13xl mq1050:leading-[35px] mq450:text-5xl mq450:leading-[26px]">
                用户名称
              </h1>
              <h3 className="m-0 self-stretch relative text-5xl leading-[150%] font-normal font-inherit mq450:text-lgi mq450:leading-[29px]">
                简介
              </h3>
              <div className="self-stretch h-[60px] relative text-xl leading-[150%] font-medium flex items-center mq450:text-base mq450:leading-[24px]">
                <span className="[line-break:anywhere]">
                  <p className="m-0">邮箱</p>
                </span>
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
