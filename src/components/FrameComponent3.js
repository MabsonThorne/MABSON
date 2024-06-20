import { useCallback } from "react";
import { Button } from "@mui/material";
import PropTypes from "prop-types";

const FrameComponent3 = ({ className = "" }) => {
  const onButtonClick = useCallback(() => {
    // Please sync "消息" to the project
  }, []);

  return (
    <div
      className={`self-stretch flex flex-row items-start justify-start gap-[140px] max-w-full text-left text-5xl text-black font-small-text lg:flex-wrap lg:gap-[70px] mq750:gap-[35px] mq450:gap-[17px] ${className}`}
    >
      <div className="flex-1 flex flex-col items-start justify-start gap-[80px] min-w-[406px] max-w-full mq750:gap-[40px] mq750:min-w-full mq450:gap-[20px]">
        <img
          className="self-stretch h-[613px] relative rounded-xl max-w-full overflow-hidden shrink-0 object-cover"
          loading="lazy"
          alt=""
          src="/image1@2x.png"
        />
        <h3 className="m-0 self-stretch relative text-inherit leading-[150%] font-normal font-inherit mq450:text-lgi mq450:leading-[29px]">
          相关商品
        </h3>
      </div>
      <div className="w-[515px] flex flex-col items-start justify-start gap-[24px] min-w-[515px] max-w-full text-xl text-gray lg:flex-1 mq750:min-w-full">
        <h1 className="m-0 self-stretch relative text-21xl leading-[110%] font-semibold font-inherit text-black mq1050:text-13xl mq1050:leading-[35px] mq450:text-5xl mq450:leading-[26px]">
          商品名称
        </h1>
        <h3 className="m-0 self-stretch relative text-5xl leading-[150%] font-normal font-inherit mq450:text-lgi mq450:leading-[29px]">
          商品描述
        </h3>
        <div className="self-stretch relative leading-[150%] font-medium text-black mq450:text-base mq450:leading-[24px]">
          预估报价：$10.99
        </div>
        <div className="self-stretch h-[300px] relative leading-[150%] font-medium flex items-center mq450:text-base mq450:leading-[24px]">
          <span className="[line-break:anywhere]">
            <p className="m-0">商品数量</p>
            <p className="m-0">&nbsp;</p>
            <p className="m-0">支持的支付方式：</p>
            <p className="m-0">&nbsp;</p>
            <p className="m-0">&nbsp;</p>
            <p className="m-0">&nbsp;</p>
            <p className="m-0">&nbsp;</p>
            <p className="m-0">&nbsp;</p>
            <p className="m-0">&nbsp;</p>
          </span>
        </div>
        <Button
          className="self-stretch h-[82px] shadow-[0px_1px_2px_rgba(0,_0,_0,_0.05)] cursor-pointer mq450:pl-5 mq450:pr-5 mq450:box-border"
          variant="contained"
          sx={{
            textTransform: "none",
            color: "#fff",
            fontSize: "36",
            background: "#ff0000",
            borderRadius: "8px",
            "&:hover": { background: "#ff0000" },
            height: 82,
          }}
          onClick={onButtonClick}
        >
          需求发布
        </Button>
        <div className="self-stretch relative text-base leading-[150%] font-medium">
          Text box for additional details or fine print
        </div>
      </div>
    </div>
  );
};

FrameComponent3.propTypes = {
  className: PropTypes.string,
};

export default FrameComponent3;
