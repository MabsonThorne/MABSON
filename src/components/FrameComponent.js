import { useMemo } from "react";
import PropTypes from "prop-types";

const FrameComponent = ({
  className = "",
  frameFooterAlignSelf,
  frameFooterFlex,
}) => {
  const frameFooterStyle = useMemo(() => {
    return {
      alignSelf: frameFooterAlignSelf,
      flex: frameFooterFlex,
    };
  }, [frameFooterAlignSelf, frameFooterFlex]);

  return (
    <footer
      className={`self-stretch flex flex-col items-start justify-start gap-[40px] max-w-full text-left text-21xl text-red font-small-text mq750:gap-[20px] ${className}`}
      style={frameFooterStyle}
    >
      <div className="self-stretch h-px relative box-border border-t-[1px] border-solid border-gainsboro-200" />
      <div className="self-stretch flex flex-row items-end justify-between max-w-full gap-[20px] mq1050:flex-wrap">
        <div className="w-[283px] flex flex-row items-end justify-start gap-[8px] min-w-[283px] mq1050:flex-1">
          <img
            className="h-10 w-10 relative rounded object-contain"
            loading="lazy"
            alt=""
            src="/buttons--icon@2x.png"
          />
          <img
            className="h-10 w-10 relative rounded object-contain"
            loading="lazy"
            alt=""
            src="/buttons--icon-1@2x.png"
          />
          <div className="flex-1 flex flex-col items-start justify-start gap-[14px]">
            <div className="self-stretch flex flex-row items-start justify-start py-0 pr-0 pl-[13px]">
              <div className="flex-1 flex flex-row items-start justify-start relative">
                <h1 className="m-0 flex-1 relative text-inherit leading-[120px] font-normal font-inherit mq450:text-5xl mq450:leading-[36px] mq1000:text-13xl mq1000:leading-[48px]">
                  <span>GO</span>
                  <span className="text-black">TONG</span>
                </h1>
                <img
                  className="h-[98px] w-[202px] absolute !m-[0] top-[-19px] left-[-154px] object-cover z-[1]"
                  loading="lazy"
                  alt=""
                  src="/logo1-1@2x.png"
                />
              </div>
            </div>
            <div className="flex flex-row items-start justify-start gap-[8px]">
              <img
                className="h-10 w-10 relative rounded object-cover min-h-[40px]"
                loading="lazy"
                alt=""
                src="/buttons--icon-2@2x.png"
              />
              <img
                className="h-10 w-10 relative rounded object-cover min-h-[40px]"
                loading="lazy"
                alt=""
                src="/buttons--icon-3@2x.png"
              />
            </div>
          </div>
        </div>
        <div className="w-[624px] flex flex-row items-start justify-start gap-[31.5px] min-w-[624px] max-w-full text-base text-darkslategray mq1000:min-w-full mq750:flex-wrap mq750:gap-[16px] mq1050:flex-1">
          <div className="flex-1 flex flex-col items-start justify-start gap-[24px] min-w-[140px]">
            <div className="self-stretch relative leading-[150%] font-medium text-black">
              Topic
            </div>
            <div className="self-stretch relative leading-[150%] font-medium">
              Page
            </div>
            <div className="self-stretch relative leading-[150%] font-medium">
              Page
            </div>
            <div className="self-stretch relative leading-[150%] font-medium">
              Page
            </div>
          </div>
          <div className="flex-1 flex flex-col items-start justify-start gap-[24px] min-w-[140px]">
            <div className="self-stretch relative leading-[150%] font-medium text-black">
              Topic
            </div>
            <div className="self-stretch relative leading-[150%] font-medium">
              Page
            </div>
            <div className="self-stretch relative leading-[150%] font-medium">
              Page
            </div>
            <div className="self-stretch relative leading-[150%] font-medium">
              Page
            </div>
          </div>
          <div className="flex-1 flex flex-col items-start justify-start gap-[24px] min-w-[140px]">
            <div className="self-stretch relative leading-[150%] font-medium text-black">
              Topic
            </div>
            <div className="self-stretch relative leading-[150%] font-medium">
              Page
            </div>
            <div className="self-stretch relative leading-[150%] font-medium">
              Page
            </div>
            <div className="self-stretch relative leading-[150%] font-medium">
              Page
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

FrameComponent.propTypes = {
  className: PropTypes.string,

  /** Style props */
  frameFooterAlignSelf: PropTypes.any,
  frameFooterFlex: PropTypes.any,
};

export default FrameComponent;
