import React, { useState } from "react";
import { TextField, Button, MenuItem, Select } from "@mui/material";
import axios from "axios";
import PropTypes from "prop-types";

const EmailRegistration = ({ className = "" }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("consumer");
  const [isRegister, setIsRegister] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isEmailChecked, setIsEmailChecked] = useState(false);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setIsEmailValid(/\S+@\S+\.\S+/.test(event.target.value));
  };

  const handleEmailBlur = async () => {
    if (!isEmailValid) return;

    try {
      const response = await axios.post("http://106.52.158.123:5000/api/check-email", { email });
      if (response.data.exists) {
        setIsRegister(false);
      } else {
        setIsRegister(true);
      }
      setIsEmailChecked(true);
    } catch (error) {
      console.error("Error checking email:", error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://106.52.158.123:5000/api/login", { email, password });
      localStorage.setItem("token", response.data.token);
      window.location.href = "http://106.52.158.123:3000";
    } catch (error) {
      console.error("Login failed:", error);
      alert("Invalid email or password. Please try again.");
    }
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post("http://106.52.158.123:5000/api/register", { username, email, password, role });
      window.location.href = `http://106.52.158.123:3000/2/${response.data.id}`;
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className={`w-[400px] flex flex-col items-start justify-start gap-[24px] max-w-full text-center text-base text-gray font-small-text ${className}`}>
      <div className="self-stretch flex flex-row items-start justify-center py-0 px-5 text-5xl text-black">
        <div className="flex flex-col items-start justify-start gap-[4px]">
          <div className="flex flex-row items-start justify-start py-0 px-8">
            <h3 className="m-0 relative text-inherit tracking-[-0.01em] leading-[150%] font-semibold font-inherit inline-block min-w-[48px] mq450:text-lgi mq450:leading-[29px]">
              {isEmailChecked ? (isRegister ? "注册" : "登录") : "登录"}
            </h3>
          </div>
          {!isEmailChecked && (
            <div className="relative text-base leading-[150%] inline-block min-w-[112px]">
              请输入您的邮箱
            </div>
          )}
        </div>
      </div>
      <div className="self-stretch flex flex-col items-start justify-start gap-[16px]">
        <TextField
          className="[border:none] bg-[transparent] self-stretch h-10 font-small-text font-medium text-xl text-gray"
          placeholder="email@domain.com"
          variant="outlined"
          value={email}
          onChange={handleEmailChange}
          onBlur={handleEmailBlur}
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
          error={!isEmailValid}
          helperText={!isEmailValid ? "请输入有效的邮箱" : ""}
        />
        {isEmailChecked && !isRegister && (
          <TextField
            className="[border:none] bg-[transparent] self-stretch h-10 font-small-text font-medium text-xl text-gray"
            placeholder="请输入密码"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
        )}
        {isEmailChecked && isRegister && (
          <>
            <TextField
              className="[border:none] bg-[transparent] self-stretch h-10 font-small-text font-medium text-xl text-gray"
              placeholder="用户名"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
            <TextField
              className="[border:none] bg-[transparent] self-stretch h-10 font-small-text font-medium text-xl text-gray"
              placeholder="请输入密码"
              variant="outlined"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            <TextField
              className="[border:none] bg-[transparent] self-stretch h-10 font-small-text font-medium text-xl text-gray"
              placeholder="确认密码"
              variant="outlined"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            <Select
              className="[border:none] bg-[transparent] self-stretch h-10 font-small-text font-medium text-xl text-gray"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              sx={{
                "& .MuiInputBase-root": {
                  height: "40px",
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  fontSize: "20px",
                },
                "& .MuiInputBase-input": { color: "#828282" },
              }}
            >
              <MenuItem value="consumer">消费者</MenuItem>
              <MenuItem value="searcher">采购者</MenuItem>
            </Select>
          </>
        )}
        {isEmailChecked && (
          <Button
            className="self-stretch h-10 mq450:pl-5 mq450:pr-5 mq450:box-border"
            disableElevation
            variant="contained"
            onClick={isRegister ? handleRegister : handleLogin}
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
            {isRegister ? "注册" : "登录"}
          </Button>
        )}
        {!isEmailChecked && (
          <Button
            className="self-stretch h-10 mq450:pl-5 mq450:pr-5 mq450:box-border"
            disableElevation
            variant="contained"
            onClick={handleLogin}
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
        )}
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
        onClick={() => {
          window.location.href = "https://google.com";
        }}
      >
        Google
      </Button>
      <Button
        className="self-stretch h-10"
        startIcon={<img width="20px" height="20px" src="/wechat.svg" />}
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
        onClick={() => {
          window.location.href = "https://wechat.com";
        }}
      >
        微信
      </Button>
      <Button
        className="self-stretch h-10"
        startIcon={<img width="20px" height="20px" src="/qq.svg" />}
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
        onClick={() => {
          window.location.href = "https://qq.com";
        }}
      >
        QQ
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
