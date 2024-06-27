// pages/Frame.js

import { useCallback, useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FrameComponent2 from "../components/FrameComponent2";
import ProductCard from "../components/ProductCard";
import UserCard from "../components/UserCard";
import FrameComponent from "../components/FrameComponent";
import FrameComponent4 from "../components/FrameComponent4";

const Frame = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchers, setSearchers] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const fetchSearchers = async () => {
    try {
      const response = await fetch("/api/searchers");
      const data = await response.json();
      setSearchers(data);
    } catch (error) {
      console.error("Failed to fetch searchers:", error);
    }
  };

  const checkLoginStatus = () => {
    setIsLoggedIn(true);
  };

  useEffect(() => {
    fetchProducts();
    fetchSearchers();
    checkLoginStatus();
  }, []);

  const onTextClick = useCallback(() => {
    navigate("/1");
  }, [navigate]);
  
return (
    <div className="w-full relative bg-white overflow-hidden flex flex-col items-start justify-start pt-[46px] px-4 pb-12 box-border gap-[100px] leading-normal tracking-normal mq450:gap-[25px] mq750:gap-[50px] mq750:px-10">
      <section className="self-stretch flex flex-col items-start justify-start pt-0 pb-5 gap-8 max-w-full text-left text-xl text-gray-100 font-small-text mq750:gap-[15px]">
        <FrameComponent4 />
        <FrameComponent2 />
        <div className="w-full flex flex-col items-center justify-center py-0 box-border max-w-full">
          <div className="w-full flex flex-row flex-wrap items-center justify-center gap-6 max-w-full">
            <div className="flex-1 flex flex-col items-start justify-start pt-4 px-0 pb-0 min-w-[319px] max-w-full">
              <div className="self-stretch rounded-lg bg-white flex flex-row items-start justify-start py-3.5 px-4 border border-solid border-gainsboro-300">
                <div className="relative leading-[150%] font-medium inline-block min-w-[40px] text-base">
                  搜索
                </div>
              </div>
            </div>
            <Button
              className="h-[62px] w-[124px]"
              variant="contained"
              sx={{
                textTransform: "none",
                color: "#fff",
                fontSize: "20",
                background: "#000",
                borderRadius: "8px",
                "&:hover": { 
                  background: "#000",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)"
                },
                width: 124,
                height: 62,
              }}
            >
              提交
            </Button>
          </div>
        </div>
        <h1
          className="m-0 w-full text-21xl leading-[110%] font-semibold font-inherit inline-block max-w-full cursor-pointer text-red mq450:text-5xl mq450:leading-[26px] mq1000:text-13xl mq1000:leading-[35px]"
          onClick={onTextClick}
        >
          <span>优质</span>
          <span className="text-black">采购者</span>
        </h1>
        <div className="self-stretch flex flex-row flex-wrap items-end justify-between min-h-[764px] max-w-full gap-[20px]">
          {searchers.slice(0, 8).map((searcher, index) => (
            <UserCard
              key={index}
              avatar={searcher.avatar}
              name={searcher.name}
              bio={searcher.bio}
              rating={searcher.rating}
              propWidth="404px"
              propMinWidth="384px"
            />
          ))}
        </div>
        <h1
          className="m-0 w-full text-21xl leading-[110%] font-semibold font-inherit inline-block max-w-full cursor-pointer text-red mq450:text-5xl mq450:leading-[26px] mq1000:text-13xl mq1000:leading-[35px]"
        >
          <span>优质</span>
          <span className="text-black">需求品</span>
        </h1>
        <div className="self-stretch flex flex-row flex-wrap items-end justify-between min-h-[764px] max-w-full gap-[20px]">
          {products.slice(0, 8).map((product, index) => (
            <ProductCard
              key={index}
              image={product.image}
              productName={product.name}
              productDescription={product.description}
              price={product.price}
              quantity={product.quantity}
              propWidth="404px"
              propMinWidth="384px"
            />
          ))}
        </div>
      </section>
      <FrameComponent />
    </div>
  );
};

export default Frame;
