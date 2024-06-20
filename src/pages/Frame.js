import { useCallback } from "react";
import { Button } from "@mui/material";
import FrameComponent2 from "../components/FrameComponent2";
import Card from "../components/Card";
import FrameComponent1 from "../components/FrameComponent1";
import FrameComponent from "../components/FrameComponent";

const Frame = () => {
  const onTextClick = useCallback(() => {
    // Please sync "采购端" to the project
  }, []);

  return (
    <div className="w-full relative bg-white overflow-hidden flex flex-col items-start justify-start pt-[46px] px-20 pb-12 box-border gap-[100px] leading-[normal] tracking-[normal] mq450:gap-[25px] mq750:gap-[50px] mq750:pl-10 mq750:pr-10 mq750:box-border">
      <section className="self-stretch flex flex-col items-start justify-start pt-0 px-0 pb-5 box-border gap-[30.5px] max-w-full text-left text-xl text-gray font-small-text mq750:gap-[15px]">
        <FrameComponent2 />
        <div className="w-[1047px] flex flex-row items-start justify-start py-0 px-px box-border max-w-full">
          <div className="flex-1 flex flex-col items-start justify-start gap-[14px] max-w-full">
            <div className="self-stretch flex flex-row items-start justify-end max-w-full">
              <div className="w-[667px] flex flex-row flex-wrap items-start justify-start gap-[52px] max-w-full mq750:gap-[26px]">
                <div className="flex-1 flex flex-col items-start justify-start pt-[15px] px-0 pb-0 box-border min-w-[319px] max-w-full">
                  <div className="self-stretch shadow-[0px_1px_2px_rgba(0,_0,_0,_0.05)] rounded-lg bg-white flex flex-row items-start justify-start py-3.5 px-4 border-[1px] border-solid border-gainsboro-300">
                    <div className="relative leading-[150%] font-medium inline-block min-w-[40px] mq450:text-base mq450:leading-[24px]">
                      搜索
                    </div>
                  </div>
                </div>
                <Button
                  className="h-[62px] w-[124px] shadow-[0px_1px_2px_rgba(0,_0,_0,_0.05)]"
                  variant="contained"
                  sx={{
                    textTransform: "none",
                    color: "#fff",
                    fontSize: "20",
                    background: "#000",
                    borderRadius: "8px",
                    "&:hover": { background: "#000" },
                    width: 124,
                    height: 62,
                  }}
                >
                  提交
                </Button>
              </div>
            </div>
            <h1
              className="m-0 w-[755px] relative text-21xl leading-[110%] font-semibold font-inherit inline-block max-w-full cursor-pointer text-red mq450:text-5xl mq450:leading-[26px] mq1000:text-13xl mq1000:leading-[35px]"
              onClick={onTextClick}
            >
              <span>优质</span>
              <span className="text-black">采购者</span>
            </h1>
          </div>
        </div>
        <div className="self-stretch flex flex-row flex-wrap items-end justify-between min-h-[764px] max-w-full gap-[20px]">
          <Card
            image="/image@2x.png"
            searcher1="Searcher1"
            descriptionOfFirstSearche="Description of first Searcher"
            prop="评分："
          />
          <Card
            image="/image-1@2x.png"
            searcher1="Searcher2"
            descriptionOfFirstSearche="Description of second Searcher"
            prop="评分："
            propWidth="404px"
            propMinWidth="384px"
          />
          <Card
            image="/image-2@2x.png"
            searcher1="Seacher3"
            descriptionOfFirstSearche="Description of third Searcher"
            prop="评分："
            propWidth="404px"
            propMinWidth="384px"
          />
          <Card
            image="/image-3@2x.png"
            searcher1="Searcher4"
            descriptionOfFirstSearche="Description of fourth Searcher"
            prop="评分："
            propWidth="404px"
            propMinWidth="384px"
          />
          <Card
            image="/image-4@2x.png"
            searcher1="Searcher5"
            descriptionOfFirstSearche="Description of fifth Searcher"
            prop="评分："
            propWidth="404px"
            propMinWidth="384px"
          />
          <Card
            image="/image-5@2x.png"
            searcher1="Searcher6"
            descriptionOfFirstSearche="Description of sixth Searcher"
            prop="评分："
            propWidth="404px"
            propMinWidth="384px"
          />
        </div>
      </section>
      <FrameComponent1 />
      <FrameComponent />
    </div>
  );
};

export default Frame;
