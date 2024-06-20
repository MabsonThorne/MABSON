import FrameComponent4 from "../components/FrameComponent4";
import FrameComponent3 from "../components/FrameComponent3";
import Card from "../components/Card";
import FrameComponent from "../components/FrameComponent";

const Frame1 = () => {
  return (
    <div className="w-full relative bg-white overflow-hidden flex flex-col items-start justify-start pt-[46px] px-20 pb-12 box-border gap-[121px] leading-[normal] tracking-[normal] mq750:gap-[60px] mq750:pl-10 mq750:pr-10 mq750:box-border mq450:gap-[30px]">
      <main className="self-stretch flex flex-col items-end justify-start gap-[46px] max-w-full mq750:gap-[23px]">
        <FrameComponent4 />
        <section className="self-stretch flex flex-col items-start justify-start gap-[24px] max-w-full">
          <FrameComponent3 />
          <div className="self-stretch grid flex-row items-start justify-start gap-[32px] max-w-full grid-cols-[repeat(3,_minmax(304px,_1fr))] lg:justify-center lg:grid-cols-[repeat(2,_minmax(304px,_528px))] mq750:gap-[16px] mq750:grid-cols-[minmax(304px,_1fr)]">
            <Card
              image="/image-11@2x.png"
              searcher1="Product "
              descriptionOfFirstSearche="Body text for first product"
              prop="预估报价$10.99"
              propWidth="unset"
              propMinWidth="unset"
            />
            <Card
              image="/image-21@2x.png"
              searcher1="Product"
              descriptionOfFirstSearche="Body text for second product"
              prop="预估报价$10.99"
              propWidth="unset"
              propMinWidth="unset"
            />
            <Card
              image="/image-31@2x.png"
              searcher1="Product"
              descriptionOfFirstSearche="Body text for third product"
              prop="预估报价$10.99"
              propWidth="unset"
              propMinWidth="unset"
            />
          </div>
        </section>
      </main>
      <FrameComponent frameFooterAlignSelf="stretch" frameFooterFlex="unset" />
    </div>
  );
};

export default Frame1;
