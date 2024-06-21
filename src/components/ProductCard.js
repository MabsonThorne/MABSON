import { useMemo, useState, useEffect } from "react";
import PropTypes from "prop-types";

const ProductCard = ({ className = "", image, productName, productDescription, price, quantity, propWidth, propMinWidth }) => {
  const cardStyle = useMemo(() => ({ width: propWidth, minWidth: propMinWidth }), [propWidth, propMinWidth]);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = image;
    img.onload = () => setImageLoaded(true);
  }, [image]);

  return (
    <div className={`w-[404px] flex flex-col items-start justify-start gap-6 min-w-[384px] max-w-full text-left text-xl text-black font-medium ${className}`} style={cardStyle}>
      <div className={`self-stretch h-[244px] relative rounded-lg overflow-hidden shrink-0 ${imageLoaded ? 'object-cover' : 'flex items-center justify-center bg-gray-200'}`}>
        {!imageLoaded && <div className="spinner"></div>}
        <img className={`self-stretch h-full w-full ${imageLoaded ? 'object-cover' : 'hidden'}`} loading="lazy" alt="" src={image} />
      </div>
      <div className="self-stretch flex flex-col items-start justify-center gap-1">
        <div className="self-stretch relative leading-[150%]">{productName}</div>
        <div className="self-stretch relative leading-[150%] text-gray">{productDescription}</div>
        <div className="self-stretch relative leading-[150%]">价格：{price}</div>
        <div className="self-stretch relative leading-[150%]">数量：{quantity}</div>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  className: PropTypes.string,
  image: PropTypes.string,
  productName: PropTypes.string,
  productDescription: PropTypes.string,
  price: PropTypes.string,
  quantity: PropTypes.string,
  propWidth: PropTypes.any,
  propMinWidth: PropTypes.any,
};

export default ProductCard;
