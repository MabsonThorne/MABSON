import { useCallback, useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FrameComponent2 from "../components/FrameComponent2";
import ProductCard from "../components/ProductCard";
import UserCard from "../components/UserCard";
import FrameComponent from "../components/FrameComponent";
import FrameComponent4 from "../components/FrameComponent4";

const Frame = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searcherIds, setSearcherIds] = useState([]);
  const [productIds, setProductIds] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://106.52.158.123:5000/api/product_ids");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProductIds(data);
    } catch (error) {
      console.error("Failed to fetch product IDs:", error);
    }
  };

  const fetchSearcherIds = async () => {
    try {
      const response = await fetch("http://106.52.158.123:5000/api/searcher_ids");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSearcherIds(data);
    } catch (error) {
      console.error("Failed to fetch searcher IDs:", error);
    }
  };

  const checkLoginStatus = () => {
    setIsLoggedIn(true);
  };

  useEffect(() => {
    fetchProducts();
    fetchSearcherIds();
    checkLoginStatus();
  }, []);

  const onTextClick = useCallback(() => {
    navigate("/1");
  }, [navigate]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = () => {
    // Implement your search logic here
    console.log("Search term:", searchTerm);
  };

  const getRandomItems = (items, numItems) => {
    const shuffled = items.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numItems);
  };

  const randomProductIds = getRandomItems(productIds, 8);
  
  return (
    <div className="w-full relative bg-white overflow-hidden flex flex-col items-start justify-start pt-[46px] px-4 pb-12 box-border gap-[100px] leading-normal tracking-normal mq450:gap-[25px] mq750:gap-[50px] mq750:px-10">
      <section className="self-stretch flex flex-col items-start justify-start pt-0 pb-5 gap-8 max-w-full text-left text-xl text-gray-100 font-small-text mq750:gap-[15px]">
        <FrameComponent4 />
        <FrameComponent2 />
        <div className="w-full flex flex-col items-center justify-center py-0 box-border max-w-full">
          <div className="w-full flex flex-row flex-wrap items-center justify-center gap-6 max-w-full">
            <div className="flex-1 flex flex-col items-center justify-center pt-4 px-0 pb-0 min-w-[319px] max-w-full">
              <TextField
                variant="outlined"
                fullWidth
                placeholder="搜索"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <Button
              className="h-[62px] w-[124px]"
              variant="contained"
              onClick={handleSearchSubmit}
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
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
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
        <div className="self-stretch flex flex-row flex-wrap items-center justify-between gap-[20px]">
          {searcherIds.slice(0, 8).map((searcher, index) => (
            <UserCard
              key={index}
              userId={searcher.id}
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
        <div className="self-stretch flex flex-row flex-wrap items-center justify-between gap-[20px]">
          {randomProductIds.map((product, index) => (
            <ProductCard
              key={index}
              productId={product.id}
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
