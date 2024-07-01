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
    navigate("/6");
  }, [navigate]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = () => {
    if (searchTerm) {
      navigate(`/9?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearchSubmit();
    }
  };

  const handleDemandClick = () => {
    navigate("/7");
  };

  const getRandomItems = (items, numItems) => {
    const shuffled = items.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numItems);
  };

  const randomProductIds = getRandomItems(productIds, 8);

  return (
    <div className="frame-container">
      <section className="header-section">
        <FrameComponent4 />
        <FrameComponent2 />
        <div className="search-container">
          <div className="search-bar">
            <TextField
              variant="outlined"
              fullWidth
              placeholder="搜索"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyPress={handleKeyPress}
            />
            <Button
              className="search-button"
              variant="contained"
              onClick={handleSearchSubmit}
            >
              提交
            </Button>
          </div>
        </div>
        <h1 className="title" onClick={onTextClick}>
          <span>优质</span>
          <span className="highlight">采购者</span>
        </h1>
        <div className="grid-container">
          <div className="card-wrapper">
            {searcherIds.slice(0, 8).map((searcher, index) => (
              <UserCard
                key={index}
                userId={searcher.id}
                propWidth="100%"
                propMinWidth="200px"
              />
            ))}
          </div>
        </div>
        <h1 className="title" onClick={handleDemandClick}>
          <span>优质</span>
          <span className="highlight">需求品</span>
        </h1>
        <div className="grid-container">
          <div className="card-wrapper">
            {randomProductIds.map((product, index) => (
              <ProductCard
                key={index}
                productId={product.id}
                propWidth="100%"
                propMinWidth="200px"
              />
            ))}
          </div>
        </div>
      </section>
      <FrameComponent />
      <style jsx>{`
        .frame-container {
          width: 100%;
          background-color: white;
          padding: 46px 20px 12px;
          box-sizing: border-box;
        }

        .header-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 25px;
        }

        .search-container {
          display: flex;
          justify-content: center;
          width: 100%;
        }

        .search-bar {
          display: flex;
          gap: 10px;
          width: 100%;
          max-width: 600px;
        }

        .search-button {
          background-color: black;
          color: white;
          text-transform: none;
          font-size: 16px;
          height: 56px; /* Same height as the TextField */
          min-width: 150px; /* Increased width */
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .title {
          width: 100%;
          text-align: left;
          font-size: 24px;
          font-weight: bold;
          cursor: pointer;
          margin-bottom: 20px;
        }

        .highlight {
          color: red;
        }

        .grid-container {
          display: flex;
          flex-direction: column;
          width: 100%;
          padding: 0 20px; /* 添加左右边框 */
          box-sizing: border-box;
        }

        .card-wrapper {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
          background-color: #f0f0f0; /* 浅灰色背景 */
          padding: 10px;
          border-radius: 8px;
        }

        @media (min-width: 1200px) {
          .card-wrapper {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        @media (max-width: 1200px) {
          .card-wrapper {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .card-wrapper {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .card-wrapper {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
};

export default Frame;
