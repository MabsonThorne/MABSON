import { useMemo } from "react";
import PropTypes from "prop-types";

const Card = ({
  className = "",
  image,
  searcher1,
  descriptionOfFirstSearche,
  prop,
  propWidth,
  propMinWidth,
}) => {
  const cardStyle = useMemo(() => {
    return {
      width: propWidth,
      minWidth: propMinWidth,
    };
  }, [propWidth, propMinWidth]);

  return (
    <div
      className={`w-[404px] flex flex-col items-start justify-start gap-[24px] min-w-[384px] max-w-full text-left text-xl text-black font-small-text mq450:min-w-full ${className}`}
      style={cardStyle}
    >
      <img
        className="self-stretch h-[244px] relative rounded-lg max-w-full overflow-hidden shrink-0 object-cover"
        loading="lazy"
        alt=""
        src={image}
      />
      <div className="self-stretch flex flex-col items-start justify-center gap-[4px]">
        <div className="self-stretch relative leading-[150%] font-medium mq450:text-base mq450:leading-[24px]">
          {searcher1}
        </div>
        <div className="self-stretch relative leading-[150%] font-medium text-gray mq450:text-base mq450:leading-[24px]">
          {descriptionOfFirstSearche}
        </div>
        <div className="self-stretch relative leading-[150%] font-medium mq450:text-base mq450:leading-[24px]">
          {prop}
        </div>
      </div>
    </div>
  );
};

Card.propTypes = {
  className: PropTypes.string,
  image: PropTypes.string,
  searcher1: PropTypes.string,
  descriptionOfFirstSearche: PropTypes.string,
  prop: PropTypes.string,

  /** Style props */
  propWidth: PropTypes.any,
  propMinWidth: PropTypes.any,
};

export default Card;
