import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import axios from "axios";
import UserCard from "../components/UserCard";
import FrameComponent4 from "../components/FrameComponent4";
import FrameComponent from "../components/FrameComponent";

const Frame6 = () => {
  const [searcherIds, setSearcherIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // 每页显示 4 行 5 列，总共 20 个卡片

  useEffect(() => {
    const fetchSearcherIds = async () => {
      try {
        const response = await axios.get("http://106.52.158.123:5000/api/searcher_ids");
        setSearcherIds(response.data.map(item => item.id.toString())); // 确保数据是字符串数组
      } catch (error) {
        console.error("Failed to fetch searcher IDs:", error);
      }
    };

    fetchSearcherIds();
  }, []);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(searcherIds.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // 计算当前页显示的卡片
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = searcherIds.slice(startIndex, startIndex + itemsPerPage);

  // 计算补充空白卡片数量
  const emptySlots = itemsPerPage - currentItems.length;

  return (
    <div className="w-full relative bg-white overflow-hidden flex flex-col items-center justify-start pt-12 pb-12 box-border gap-12 leading-normal tracking-normal">
      <style>{`
        .grid-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 24px;
          justify-items: center;
        }

        .pagination-container {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 20px;
          gap: 20px;
        }

        @media (min-width: 1200px) {
          .grid-container {
            grid-template-columns: repeat(5, 1fr);
          }
        }
      `}</style>
      <main className="self-stretch flex flex-col items-center justify-start gap-12 max-w-full">
        <FrameComponent4 />
        <section className="self-stretch flex flex-col items-center justify-start gap-6 max-w-full">
          <div className="grid-container">
            {currentItems.map((id, index) => (
              <UserCard key={index} userId={id} propWidth="100%" propMinWidth="200px" />
            ))}
            {Array.from({ length: emptySlots }).map((_, index) => (
              <div key={index} style={{ visibility: "hidden", width: "100%" }}>Empty</div>
            ))}
          </div>
          <div className="pagination-container">
            <Button variant="contained" onClick={handlePreviousPage} disabled={currentPage === 1}>
              上一页
            </Button>
            <span>
              {currentPage} / {Math.ceil(searcherIds.length / itemsPerPage)}
            </span>
            <Button
              variant="contained"
              onClick={handleNextPage}
              disabled={currentPage === Math.ceil(searcherIds.length / itemsPerPage)}
            >
              下一页
            </Button>
          </div>
        </section>
      </main>
      <FrameComponent frameFooterAlignSelf="stretch" frameFooterFlex="unset" />
    </div>
  );
};

export default Frame6;
