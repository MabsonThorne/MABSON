import React, { useCallback, useState, useEffect } from "react";
import { Button } from "@mui/material";
import PropTypes from "prop-types";
import axios from "axios";

const FrameComponent3 = ({ className = "" }) => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // 获取当前登录用户的 ID
    axios.get(`http://106.52.158.123:5000/api/profile`, { withCredentials: true })
      .then(response => {
        setUserId(response.data.id);
      })
      .catch(error => {
        console.error("Error fetching current user profile:", error);
      });
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
  };

  const togglePaymentMethod = (method) => {
    setPaymentMethods((prevMethods) =>
      prevMethods.includes(method)
        ? prevMethods.filter((m) => m !== method)
        : [...prevMethods, method]
    );
  };

  const handleSubmit = () => {
    if (!image || !productName || !productPrice || !productQuantity || paymentMethods.length === 0) {
      alert("请填写所有必填字段。");
      return;
    }

    const formData = new FormData();
    formData.append("name", productName);
    formData.append("price", productPrice);
    formData.append("quantity", productQuantity);
    formData.append("description", productDescription);
    formData.append("user_id", userId);
    formData.append("image", image);
    formData.append("paymentMethods", paymentMethods.join(","));

    axios
      .post(`http://106.52.158.123:5000/api/products`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        window.location.href = `http://106.52.158.123:3000/3/${userId}`;
      })
      .catch((error) => {
        console.error("创建产品时出错:", error);
      });
  };

  return (
    <div
      className={`self-stretch flex flex-row items-start justify-start gap-[140px] max-w-full text-left text-5xl text-black font-small-text lg:flex-wrap lg:gap-[70px] mq750:gap-[35px] mq450:gap-[17px] ${className}`}
    >
      <div className="flex-1 flex flex-col items-start justify-start gap-[80px] min-w-[406px] max-w-full mq750:gap-[40px] mq750:min-w-full mq450:gap-[20px]">
        <div className="self-stretch h-[613px] relative rounded-xl max-w-full overflow-hidden shrink-0 flex items-center justify-center bg-gray-200 shadow-lg">
          {!imagePreview && (
            <label className="cursor-pointer flex items-center justify-center w-full h-full">
              <span className="text-5xl text-gray-400">+</span>
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
            </label>
          )}
          {imagePreview && <img src={imagePreview} alt="Product Preview" className="object-cover w-full h-full" />}
        </div>
        <h3 className="m-0 self-stretch relative text-inherit leading-[150%] font-normal font-inherit mq450:text-lgi mq450:leading-[29px]">
          相关商品
        </h3>
      </div>
      <div className="w-[515px] flex flex-col items-start justify-start gap-[24px] min-w-[515px] max-w-full text-xl text-gray lg:flex-1 mq750:min-w-full">
        <input
          className="m-0 self-stretch relative text-21xl leading-[110%] font-semibold font-inherit text-black mq1050:text-13xl mq1050:leading-[35px] mq450:text-5xl mq450:leading-[26px] bg-transparent border-none outline-none"
          placeholder="商品名称"
          value={productName}
          onChange={handleInputChange(setProductName)}
        />
        <textarea
          className="m-0 self-stretch relative text-5xl leading-[150%] font-normal font-inherit mq450:text-lgi mq450:leading-[29px] bg-transparent border-none outline-none resize-none"
          placeholder="商品描述"
          value={productDescription}
          onChange={handleInputChange(setProductDescription)}
        />
        <input
          className="self-stretch relative leading-[150%] font-medium text-black mq450:text-base mq450:leading-[24px] bg-transparent border-none outline-none"
          placeholder="预估报价：$10.99"
          value={productPrice}
          onChange={handleInputChange(setProductPrice)}
        />
        <input
          className="self-stretch relative leading-[150%] font-medium text-black mq450:text-base mq450:leading-[24px] bg-transparent border-none outline-none"
          placeholder="商品数量"
          value={productQuantity}
          onChange={handleInputChange(setProductQuantity)}
        />
        <div className="flex flex-col gap-2">
          <div className="self-stretch relative leading-[150%] font-medium text-black mq450:text-base mq450:leading-[24px]">
            支持的支付方式：
          </div>
          {["支付宝", "微信支付", "PayPal"].map((method) => (
            <button
              key={method}
              className={`w-full py-2 rounded-lg shadow-md ${paymentMethods.includes(method) ? 'border-2 border-red-500' : ''}`}
              onClick={() => togglePaymentMethod(method)}
            >
              {method}
            </button>
          ))}
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
          onClick={handleSubmit}
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
