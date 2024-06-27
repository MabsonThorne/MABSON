import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';
import PropTypes from 'prop-types';

const FrameComponent3 = ({ className = "" }) => {
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [image, setImage] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios.get('http://106.52.158.123:5000/api/profile', { withCredentials: true })
      .then(response => {
        setCurrentUserId(response.data.id);
      })
      .catch(error => {
        console.error('Error fetching current user profile:', error);
      });
  }, []);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethods(prev => {
      if (prev.includes(method)) {
        return prev.filter(m => m !== method);
      } else {
        return [...prev, method];
      }
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!productName) newErrors.productName = '商品名称不能为空';
    if (!productDescription) newErrors.productDescription = '商品描述不能为空';
    if (!price) newErrors.price = '预估报价不能为空';
    if (!quantity) newErrors.quantity = '商品数量不能为空';
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formData = new FormData();
    formData.append('name', productName);
    formData.append('description', productDescription);
    formData.append('price', price);
    formData.append('quantity', quantity);
    formData.append('paymentMethods', paymentMethods.join(','));
    formData.append('image', image);

    // 打印 FormData 内容
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      await axios.post('http://106.52.158.123:5000/api/products', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      window.location.href = `http://106.52.158.123:3000/3/${currentUserId}`;
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  return (
    <div className={`self-stretch flex flex-row items-start justify-start gap-[140px] max-w-full text-left text-5xl text-black font-small-text lg:flex-wrap lg:gap-[70px] mq750:gap-[35px] mq450:gap-[17px] ${className}`}>
      <div className="flex-1 flex flex-col items-start justify-start gap-[80px] min-w-[406px] max-w-full mq750:gap-[40px] mq750:min-w-full mq450:gap-[20px]">
        <button className="self-stretch h-[613px] relative rounded-xl max-w-full overflow-hidden shrink-0 flex items-center justify-center bg-gray-200 shadow-lg" onClick={() => document.getElementById('image-upload').click()}>
          {image ? (
            <img src={URL.createObjectURL(image)} alt="Product" className="object-cover w-full h-full" />
          ) : (
            <span className="text-6xl">+</span>
          )}
          <input id="image-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
        </button>
        <h3 className="m-0 self-stretch relative text-inherit leading-[150%] font-normal font-inherit mq450:text-lgi mq450:leading-[29px]">
          相关商品
        </h3>
      </div>
      <div className="w-[515px] flex flex-col items-start justify-start gap-[24px] min-w-[515px] max-w-full text-xl text-gray lg:flex-1 mq750:min-w-full">
        <input type="text" className="m-0 self-stretch relative text-21xl leading-[110%] font-semibold font-inherit text-black mq1050:text-13xl mq1050:leading-[35px] mq450:text-5xl mq450:leading-[26px]" placeholder="商品名称" value={productName} onChange={(e) => setProductName(e.target.value)} />
        {errors.productName && <span className="text-red-500">{errors.productName}</span>}
        <textarea className="m-0 self-stretch relative text-5xl leading-[150%] font-normal font-inherit mq450:text-lgi mq450:leading-[29px]" placeholder="商品描述" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} />
        {errors.productDescription && <span className="text-red-500">{errors.productDescription}</span>}
        <input type="text" className="self-stretch relative leading-[150%] font-medium text-black mq450:text-base mq450:leading-[24px]" placeholder="预估报价" value={price} onChange={(e) => setPrice(e.target.value)} />
        {errors.price && <span className="text-red-500">{errors.price}</span>}
        <input type="text" className="self-stretch relative leading-[150%] font-medium text-black mq450:text-base mq450:leading-[24px]" placeholder="商品数量" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        {errors.quantity && <span className="text-red-500">{errors.quantity}</span>}
        <div className="self-stretch relative leading-[150%] font-medium">
          支持的支付方式：
          <div className="flex flex-col gap-4 mt-2">
            {['支付宝', '微信支付', 'PayPal'].map((method) => (
              <button key={method} className={`bg-white shadow p-2 rounded ${paymentMethods.includes(method) ? 'border-2 border-red-500' : ''}`} onClick={() => handlePaymentMethodChange(method)}>
                {method}
              </button>
            ))}
          </div>
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
