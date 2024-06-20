import FrameComponent4 from "../components/FrameComponent4";
import ProfileContent from "../components/ProfileContent";
import FrameComponent6 from "../components/FrameComponent6";

const Frame3 = () => {
  return (
    <div className="w-full relative bg-white overflow-hidden flex flex-col items-end justify-start pt-[46px] pb-12 pr-20 pl-12 box-border gap-[88px] leading-[normal] tracking-[normal] mq750:gap-[44px] mq750:pl-6 mq750:pr-10 mq750:box-border mq450:gap-[22px]">
      <FrameComponent4 />
      <main className="self-stretch flex flex-col items-start justify-start gap-[30px] max-w-full">
        <ProfileContent />
        <FrameComponent6 />
      </main>
    </div>
  );
};

export default Frame3;
