import PropTypes from "prop-types";

const Card1 = ({ className = "" }) => {
  return (
    <div
      className={`h-[266px] w-[219px] flex flex-col items-start justify-start gap-[24px] text-left text-xl text-black font-small-text ${className}`}
    >
      <img
        className="self-stretch flex-1 relative rounded-lg max-w-full overflow-hidden max-h-full object-cover"
        loading="lazy"
        alt=""
        src="/image2@2x.png"
      />
      <div className="self-stretch flex flex-col items-start justify-center gap-[4px]">
        <div className="self-stretch relative leading-[150%] font-medium mq450:text-base mq450:leading-[24px]">
          Title
        </div>
        <div className="self-stretch relative leading-[150%] font-medium text-gray mq450:text-base mq450:leading-[24px]">
          Author
        </div>
      </div>
    </div>
  );
};

Card1.propTypes = {
  className: PropTypes.string,
};

export default Card1;
