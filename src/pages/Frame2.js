import FrameComponent5 from "../components/FrameComponent5";
import FrameComponent from "../components/FrameComponent";

const Frame2 = () => {
  return (
    <div className="w-full relative bg-white overflow-hidden flex flex-col items-start justify-start pt-[55px] px-20 pb-12 box-border gap-[225px] leading-[normal] tracking-[normal] mq750:gap-[112px] mq750:pl-10 mq750:pr-10 mq750:box-border mq450:gap-[56px]">
      <header className="self-stretch flex flex-row items-start justify-center py-0 pr-0 pl-[76px] text-left text-21xl text-red font-small-text mq450:pl-5 mq450:box-border">
        <div className="w-[174px] flex flex-row items-start justify-start relative">
          <img
            className="h-[98px] w-[202px] absolute !m-[0] top-[-19px] left-[-168px] object-cover"
            loading="lazy"
            alt=""
            src="/logo1-1@2x.png"
          />
          <h1 className="m-0 flex-1 relative text-inherit leading-[120px] font-normal font-inherit z-[1]">
            <span>GO</span>
            <span className="text-black">TONG</span>
          </h1>
        </div>
      </header>
      <section className="self-stretch flex flex-row items-start justify-end pt-0 px-8 pb-[166px] box-border max-w-full mq1050:pb-[108px] mq1050:box-border mq450:pb-[70px] mq450:box-border">
        <FrameComponent5 />
      </section>
      <FrameComponent frameFooterAlignSelf="stretch" frameFooterFlex="unset" />
    </div>
  );
};

export default Frame2;
