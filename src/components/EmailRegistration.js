import {
  TextField,
  InputAdornment,
  Icon,
  IconButton,
  Button,
} from "@mui/material";
import PropTypes from "prop-types";

const EmailRegistration = ({ className = "" }) => {
  return (
    <div
      className={`w-[400px] flex flex-col items-start justify-start gap-[24px] max-w-full text-center text-base text-gray font-small-text ${className}`}
    >
      <div className="self-stretch flex flex-row items-start justify-center py-0 px-5 text-5xl text-black">
        <div className="flex flex-col items-start justify-start gap-[4px]">
          <div className="flex flex-row items-start justify-start py-0 px-8">
            <h3 className="m-0 relative text-inherit tracking-[-0.01em] leading-[150%] font-semibold font-inherit inline-block min-w-[48px] mq450:text-lgi mq450:leading-[29px]">
              登录
            </h3>
          </div>
          <div className="relative text-base leading-[150%] inline-block min-w-[112px]">
            请输入您的邮箱
          </div>
        </div>
      </div>
      <div className="self-stretch flex flex-col items-start justify-start gap-[16px]">
        <TextField
          className="[border:none] bg-[transparent] self-stretch h-10 font-small-text font-medium text-xl text-gray"
          placeholder="email@domain.com"
          variant="outlined"
          sx={{
            "& fieldset": { borderColor: "#e0e0e0" },
            "& .MuiInputBase-root": {
              height: "40px",
              backgroundColor: "#fff",
              borderRadius: "8px",
              fontSize: "20px",
            },
            "& .MuiInputBase-input": { color: "#828282" },
          }}
        />
        <Button
          className="self-stretch h-10 mq450:pl-5 mq450:pr-5 mq450:box-border"
          disableElevation
          variant="contained"
          sx={{
            textTransform: "none",
            color: "#fff",
            fontSize: "16",
            background: "#ff0000",
            borderRadius: "8px",
            "&:hover": { background: "#ff0000" },
            height: 40,
          }}
        >
          登录
        </Button>
      </div>
      <div className="self-stretch flex flex-row flex-wrap items-start justify-start gap-[8px]">
        <div className="flex-1 flex flex-col items-start justify-start pt-[11.5px] px-0 pb-0 box-border min-w-[104px]">
          <div className="self-stretch h-px relative bg-gainsboro-200" />
        </div>
        <div className="relative leading-[150%] inline-block min-w-[64px]">
          其他方式
        </div>
        <div className="flex-1 flex flex-col items-start justify-start pt-[11.5px] px-0 pb-0 box-border min-w-[104px]">
          <div className="self-stretch h-px relative bg-gainsboro-200" />
        </div>
      </div>
      <Button
        className="self-stretch h-10"
        startIcon={<img width="20px" height="20px" src="/google.svg" />}
        disableElevation
        variant="contained"
        sx={{
          textTransform: "none",
          color: "#000",
          fontSize: "16",
          background: "#eee",
          borderRadius: "8px",
          "&:hover": { background: "#eee" },
          height: 40,
        }}
      >
        Google
      </Button>
      <div className="self-stretch relative leading-[150%]">
        点击继续代表您同意我们的隐私政策
      </div>
    </div>
  );
};

EmailRegistration.propTypes = {
  className: PropTypes.string,
};

export default EmailRegistration;