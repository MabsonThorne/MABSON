import { useMemo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ className = "", productId, propWidth, propMinWidth }) => {
  const navigate = useNavigate();
  const cardStyle = useMemo(() => ({
    width: propWidth,
    minWidth: propMinWidth,
    borderRadius: '15px', // 添加圆角效果
    backgroundColor: 'white', // 白色背景
    border: '1px solid #ccc', // 添加边框
    padding: '10px', // 添加内边距
    cursor: 'pointer' // 鼠标悬停时显示指针
  }), [propWidth, propMinWidth]);

  const [productData, setProductData] = useState({ image: '', product_name: '', product_description: '', price: '', quantity: '' });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(`http://106.52.158.123:5000/api/products/${productId}`);
        if (response.status === 200) {
          setProductData(response.data);
          setError(null);  // 清除之前的错误
        } else {
          setError('Product not found');
        }
      } catch (error) {
        setError('Error fetching product data');
        console.error('Error fetching product data:', error);
      }
    };

    if (productId) {
      fetchProductData();
    } else {
      setError('Product ID is required');
    }
  }, [productId]);

  useEffect(() => {
    if (productData.image) {
      const img = new Image();
      img.src = productData.image;
      img.onload = () => setImageLoaded(true);
      img.onerror = () => setError('Error loading image');
    }
  }, [productData.image]);

  const handleClick = () => {
    navigate(`/5/${productId}`);
  };

  return (
    <div 
      onClick={handleClick} 
      className={`flex flex-col items-start justify-start gap-6 min-w-[200px] max-w-full text-left text-xl text-black font-medium ${className}`} 
      style={cardStyle}
    >
      <div 
        className={`w-full relative rounded-lg overflow-hidden shrink-0 ${imageLoaded ? 'object-cover' : 'flex items-center justify-center bg-gray-200'}`} 
        style={{ height: 'auto', aspectRatio: '16/9' }}
      >
        {!imageLoaded && !error && <div className="spinner"></div>}
        {error && <div className="text-red-500">{error}</div>}
        <img 
          className={`w-full ${imageLoaded ? 'object-cover' : 'hidden'}`} 
          loading="lazy" 
          alt={productData.product_name} 
          src={productData.image} 
        />
      </div>
      <div className="w-full flex flex-col items-start justify-center gap-1">
        <div className="relative leading-[150%]">{productData.product_name}</div>
        <div className="relative leading-[150%]">价格：{productData.price}</div>
        <div className="relative leading-[150%]">数量：{productData.quantity}</div>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  className: PropTypes.string,
  productId: PropTypes.string.isRequired,
  propWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  propMinWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default ProductCard;
