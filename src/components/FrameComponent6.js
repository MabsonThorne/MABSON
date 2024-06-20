import FrameComponent from "./FrameComponent";
import PropTypes from "prop-types";

const FrameComponent6 = ({ className = "" }) => {
  return (
    <footer
      className={`self-stretch flex flex-row items-start justify-start py-0 pr-0 pl-8 box-border max-w-full ${className}`}
    >
      <FrameComponent frameFooterAlignSelf="unset" frameFooterFlex="1" />
    </footer>
  );
};

FrameComponent6.propTypes = {
  className: PropTypes.string,
};

export default FrameComponent6;
