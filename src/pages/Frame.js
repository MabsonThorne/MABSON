import { useCallback, useEffect, useState } from "react";
import { Button } from "@mui/material";
import FrameComponent2 from "../components/FrameComponent2";
import ProductCard from "../components/ProductCard";
import UserCard from "../components/UserCard";
import FrameComponent1 from "../components/FrameComponent1";
import FrameComponent from "../components/FrameComponent";

const Frame = () => {
  const [products, setProducts] = useState([]);
  const [searchers, setSearchers] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 假设有两个函数 `fetchProducts` 和 `fetchSearchers` 用于从数据库获取商品和优质采购者数据
    const fetchProducts = async () => {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data);
    };

    const fetchSearchers = async () => {
      const response = await fetch("/api/searchers");
      const data = await response.json();
      setSearchers(data);
    };

    fetchProducts();
    fetchSearchers();

    // 假设有一个函数 `checkLoginStatus` 用于检查用户是否登录
    const checkLoginStatus = () => {
      // 这里应该有一个实际的登录状态检查逻辑
      setIsLoggedIn(true); // 根据实际登录状态设置
    };
    checkLoginStatus();
  }, []);

  const onTextClick = useCallback(() => {
    // Navigate to "采购端"
  }, []);

  return (
    <div className="w-full relative bg-white overflow-hidden flex flex-col items-start justify-start pt-12 px-20 pb-12 gap-24 leading-normal tracking-normal">
      <section className="self-stretch flex flex-col items-start justify-start pb-5 gap-8 text-left text-xl text-gray font-medium">
        <FrameComponent2 />
        <div className="w-full flex flex-row items-start justify-start py-0 box-border">
          <div className="flex-1 flex flex-col items-start justify-start gap-4">
            <div className="self-stretch flex flex-row items-start justify-end">
              <div className="w-full flex flex-row flex-wrap items-start justify-start gap-10">
                <div className="flex-1 flex flex-col items-start justify-start pt-4 min-w-[319px]">
                  <div className="self-stretch shadow-md rounded-lg bg-white flex items-start justify-start py-4 px-4 border border-gray-300">
                    <div className="font-medium">搜索</div>
                  </div>
                </div>
                <Button className="h-[62px] w-[124px] shadow-md" variant="contained" sx={{ textTransform: "none", color: "#fff", fontSize: "20", background: "#000", borderRadius: "8px", "&:hover": { background: "#000" } }}>
                  提交
                </Button>
              </div>
            </div>
            <h1 className="m-0 w-full text-4xl leading-snug font-semibold cursor-pointer text-red" onClick={onTextClick}>
              <span>优质</span><span className="text-black">采购者</span>
            </h1>
          </div>
        </div>
        <div className="self-stretch flex flex-row flex-wrap items-end justify-between gap-5">
          {searchers.slice(0, 8).map((searcher, index) => (
            <UserCard key={index} avatar={searcher.avatar} name={searcher.name} bio={searcher.bio} rating={searcher.rating} />
          ))}
        </div>
        <h1 className="m-0 w-full text-4xl leading-snug font-semibold cursor-pointer text-red" onClick={onTextClick}>
          <span>优质</span><span className="text-black">需求品</span>
        </h1>
        <div className="self-stretch flex flex-row flex-wrap items-end justify-between gap-5">
          {products.slice(0, 8).map((product, index) => (
            <ProductCard key={index} image={product.image} productName={product.name} productDescription={product.description} price={product.price} quantity={product.quantity} />
          ))}
        </div>
      </section>
      <FrameComponent1 />
      <FrameComponent />
    </div>
  );
};

export default Frame;
