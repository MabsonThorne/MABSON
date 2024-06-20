import Card from "./Card";
import PropTypes from "prop-types";

const FrameComponent1 = ({ className = "" }) => {
  return (
    <section
      className={`self-stretch flex flex-col items-start justify-start gap-[53px] max-w-full text-left text-21xl text-red font-small-text mq750:gap-[26px] ${className}`}
    >
      <h1 className="m-0 w-[742px] relative text-inherit leading-[110%] font-semibold font-inherit inline-block max-w-full mq450:text-5xl mq450:leading-[26px] mq1000:text-13xl mq1000:leading-[35px]">
        <span>紧急</span>
        <span className="text-black">需求</span>
      </h1>
      <div className="self-stretch flex flex-row flex-wrap items-end justify-between min-h-[764px] max-w-full gap-[20px]">
        <Card
          image="/image@2x.png"
          searcher1="Searcher1"
          descriptionOfFirstSearche="Description of first Searcher"
          prop="评分："
          propWidth="404px"
          propMinWidth="384px"
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
  );
};

FrameComponent1.propTypes = {
  className: PropTypes.string,
};

export default FrameComponent1;
