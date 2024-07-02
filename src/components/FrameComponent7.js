import { useCallback, useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";
import Cookies from "js-cookie";

const paymentMethodsOrder = ["支付宝", "微信支付", "PayPal"];

const FrameComponent7 = ({ className = "", productId }) => {
  const navigate = useNavigate();
  const [productData, setProductData] = useState({
    image: "",
    name: "",
    description: "",
    price: "",
    quantity: "",
    payment_methods: "",
    user_id: "",
  });
  const [editing, setEditing] = useState(false);
  const [newProductData, setNewProductData] = useState({});
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(`http://106.52.158.123:5000/api/products/${productId}`);
        setProductData({
          image: response.data.image,
          name: response.data.product_name,
          description: response.data.product_description,
          price: response.data.price,
          quantity: response.data.quantity,
          payment_methods: response.data.payment_methods,
          user_id: response.data.user_id,
        });
        setPaymentMethods(response.data.payment_methods.split(","));
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    const fetchUserId = async () => {
      try {
        const response = await axios.get("http://106.52.158.123:5000/api/profile", {
          headers: { Authorization: `Bearer ${Cookies.get('authToken')}` }
        });
        setUserId(response.data.id);
      } catch (error) {
        console.error("Error fetching user id:", error);
        setUserId(null);
      }
    };

    if (productId) {
      fetchProductData();
      fetchUserId();
    }
  }, [productId]);

  const handleEditClick = () => {
    setEditing(true);
    setNewProductData(productData);
  };

  const handleCancelClick = () => {
    setEditing(false);
    setNewProductData({});
    setPaymentMethods(productData.payment_methods.split(","));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProductData({ ...newProductData, [name]: value });
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethods((prev) =>
      prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method]
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewProductData({ ...newProductData, image: file });

    const reader = new FileReader();
    reader.onloadend = () => {
      setProductData({ ...productData, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSaveClick = async () => {
    const formData = new FormData();
    formData.append("name", newProductData.name);
    formData.append("description", newProductData.description);
    formData.append("price", newProductData.price);
    formData.append("quantity", newProductData.quantity);
    formData.append("payment_methods", paymentMethods.join(","));
    if (newProductData.image) {
      formData.append("image", newProductData.image);
    }

    try {
      await axios.put(`http://106.52.158.123:5000/api/products/${productId}`, formData, {
        headers: {
          "Authorization": `Bearer ${Cookies.get('authToken')}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setEditing(false);
      setProductData({ ...productData, ...newProductData, payment_methods: paymentMethods.join(",") });
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const onButtonClick = useCallback(() => {
    if (!userId) {
      navigate("/4"); // 未登录状态跳转到登录页面
    } else {
      navigate(`/chat/${userId}`, { state: { targetUserId: productData.user_id } });
    }
  }, [navigate, userId, productData.user_id]);

  const renderPaymentButtons = () => {
    return editing
      ? paymentMethodsOrder.map((method) => (
          <Button
            key={method}
            variant="contained"
            sx={{
              textTransform: "none",
              color: "#000",
              fontSize: "20px",
              background: "#fff",
              border: paymentMethods.includes(method) ? "2px solid red" : "none",
              borderRadius: "8px",
              margin: "0 10px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
              "&:hover": { background: "#f0f0f0" },
              height: 50,
              minWidth: 150,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => handlePaymentMethodChange(method)}
          >
            {method}
          </Button>
        ))
      : paymentMethods.map((method) => (
          <Button
            key={method}
            variant="contained"
            sx={{
              textTransform: "none",
              color: "#000",
              fontSize: "20px",
              background: "#fff",
              borderRadius: "8px",
              margin: "0 10px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
              height: 50,
              minWidth: 150,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            {method}
          </Button>
        ));
  };

  return (
    <div
      className={`self-stretch flex flex-row items-start justify-start gap-[140px] max-w-full text-left text-5xl text-text-primary font-small-text lg:flex-wrap lg:gap-[70px] mq750:gap-[35px] mq450:gap-[17px] ${className}`}
    >
      <div className="flex-1 flex flex-col items-start justify-start gap-[80px] min-w-[406px] max-w-full mq750:gap-[40px] mq750:min-w-full mq450:gap-[20px]">
        {editing ? (
          <button
            className="self-stretch h-[613px] relative rounded-xl max-w-full overflow-hidden shrink-0 flex items-center justify-center bg-gray-200 shadow-lg"
            onClick={() => document.getElementById("image-upload").click()}
          >
            <img src={productData.image} alt="Product" className="object-cover w-full h-full" />
            <input id="image-upload" type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageChange} />
          </button>
        ) : (
          <img className="self-stretch h-[613px] relative rounded-xl max-w-full overflow-hidden shrink-0 object-cover" loading="lazy" alt="" src={productData.image} />
        )}
        <h3 className="m-0 self-stretch relative text-inherit leading-[150%] font-normal font-inherit mq450:text-lgi mq450:leading-[29px]">相关商品</h3>
      </div>
      <div className="w-[515px] flex flex-col items-start justify-start gap-[24px] min-w-[515px] max-w-full text-xl text-gray-100 lg:flex-1 mq750:min-w-full">
        {editing ? (
          <>
            <input
              type="text"
              name="name"
              value={newProductData.name}
              onChange={handleChange}
              className="m-0 self-stretch relative text-21xl leading-[110%] font-semibold font-inherit text-black mq1050:text-13xl mq1050:leading-[35px] mq450:text-5xl mq450:leading-[26px]"
              placeholder="商品名称"
            />
            <textarea
              name="description"
              value={newProductData.description}
              onChange={handleChange}
              className="m-0 self-stretch relative text-5xl leading-[150%] font-normal font-inherit mq450:text-lgi mq450:leading-[29px]"
              placeholder="商品描述"
            />
            <input
              type="text"
              name="price"
              value={newProductData.price}
              onChange={handleChange}
              className="self-stretch relative leading-[150%] font-medium text-black mq450:text-base mq450:leading-[24px]"
              placeholder="预估报价"
            />
            <input
              type="text"
              name="quantity"
              value={newProductData.quantity}
              onChange={handleChange}
              className="self-stretch relative leading-[150%] font-medium text-black mq450:text-base mq450:leading-[24px]"
              placeholder="商品数量"
            />
            <div className="self-stretch h-[300px] relative leading-[150%] font-medium flex flex-col items-start mq450:text-base mq450:leading-[24px]">
              <span className="[line-break:anywhere]">
                <p className="m-0">&nbsp;</p>
                <p className="m-0">支持的支付方式：</p>
                <div className="flex flex-row mt-2">{renderPaymentButtons()}</div>
              </span>
            </div>
          </>
        ) : (
          <>
            <h1 className="m-0 self-stretch relative text-21xl leading-[110%] font-semibold font-inherit text-text-primary mq1050:text-13xl mq1050:leading-[35px] mq450:text-5xl mq450:leading-[26px]">{productData.name}</h1>
            <h3 className="m-0 self-stretch relative text-5xl leading-[150%] font-normal font-inherit mq450:text-lgi mq450:leading-[29px]">{productData.description}</h3>
            <div className="self-stretch relative leading-[150%] font-medium text-text-primary mq450:text-base mq450:leading-[24px]">预估报价：${productData.price}</div>
            <div className="self-stretch h-[300px] relative leading-[150%] font-medium flex flex-col items-start mq450:text-base mq450:leading-[24px]">
              <span className="[line-break:anywhere]">
                <p className="m-0">商品数量：{productData.quantity}</p>
                <p className="m-0">&nbsp;</p>
                <p className="m-0">支持的支付方式：</p>
                <div className="flex flex-row mt-2">{renderPaymentButtons()}</div>
              </span>
            </div>
          </>
        )}
        {userId === productData.user_id ? (
          editing ? (
            <div className="self-stretch flex flex-row justify-between gap-4">
              <Button
                className="h-[82px] shadow-[0px_1px_2px_rgba(0,_0,_0,_0.05)] cursor-pointer mq450:pl-5 mq450:pr-5 mq450:box-border"
                variant="contained"
                sx={{ textTransform: "none", color: "#fff", fontSize: "36", background: "#ff0000", borderRadius: "8px", "&:hover": { background: "#ff0000" }, height: 82, width: "45%" }}
                onClick={handleCancelClick}
              >
                取消
              </Button>
              <Button
                className="h-[82px] shadow-[0px_1px_2px_rgba(0,_0,_0,_0.05)] cursor-pointer mq450:pl-5 mq450:pr-5 mq450:box-border"
                variant="contained"
                sx={{ textTransform: "none", color: "#fff", fontSize: "36", background: "#ff0000", borderRadius: "8px", "&:hover": { background: "#ff0000" }, height: 82, width: "45%" }}
                onClick={handleSaveClick}
              >
                完成
              </Button>
            </div>
          ) : (
            <Button
              className="self-stretch h-[82px] shadow-[0px_1px_2px_rgba(0,_0,_0,_0.05)] cursor-pointer mq450:pl-5 mq450:pr-5 mq450:box-border"
              variant="contained"
              sx={{ textTransform: "none", color: "#fff", fontSize: "36", background: "#ff0000", borderRadius: "8px", "&:hover": { background: "#ff0000" }, height: 82 }}
              onClick={handleEditClick}
            >
              编辑
            </Button>
          )
        ) : (
          <Button
            className="self-stretch h-[82px] shadow-[0px_1px_2px_rgba(0,_0,_0,_0.05)] cursor-pointer mq450:pl-5 mq450:pr-5 mq450:box-border"
            variant="contained"
            sx={{ textTransform: "none", color: "#fff", fontSize: "36", background: "#ff0000", borderRadius: "8px", "&:hover": { background: "#ff0000" }, height: 82 }}
            onClick={onButtonClick}
          >
            聊一聊
          </Button>
        )}
        <div className="self-stretch relative text-base leading-[150%] font-medium">Text box for additional details or fine print</div>
      </div>
    </div>
  );
};

FrameComponent7.propTypes = {
  className: PropTypes.string,
  productId: PropTypes.string.isRequired,
};

export default FrameComponent7;
