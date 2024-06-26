import Card1 from "./Card1";
import PropTypes from "prop-types";

const ProfileContent = ({ className = "" }) => {
  return (
    <section
      className={`w-[1279px] flex flex-row items-end justify-start gap-[95px] max-w-full text-left text-45xl text-text-primary font-small-text mq750:gap-[47px] mq450:gap-[24px] mq1125:flex-wrap ${className}`}
    >
      <div className="flex-1 flex flex-col items-start justify-end pt-0 px-0 pb-[23px] box-border max-w-full mq750:min-w-full">
        <div className="self-stretch flex flex-col items-start justify-start gap-[37px] max-w-full mq450:gap-[18px]">
          <h1 className="m-0 w-[624px] relative text-inherit tracking-[-0.02em] font-bold font-inherit inline-block max-w-full mq1050:text-32xl mq450:text-19xl">
            发布过的
          </h1>
          <div className="self-stretch flex flex-col items-end justify-start py-0 pr-[42px] pl-0 box-border gap-[31px] max-w-full text-xl mq1050:pr-[21px] mq1050:box-border mq450:gap-[15px]">
            <div className="self-stretch flex flex-row flex-wrap items-start justify-start gap-[30px] min-h-[554px]">
              <Card1 />
              <Card1 />
              <Card1 />
              <Card1 />
              <Card1 />
              <Card1 />
            </div>
            <div className="w-[686px] flex flex-row items-start justify-center py-0 px-5 box-border max-w-full text-base">
              <div className="rounded-xl bg-whitesmoke-200 overflow-x-auto flex flex-row items-start justify-start p-2 gap-[8px]">
                <div className="rounded-lg bg-whitesmoke-200 flex flex-row items-start justify-start py-2 px-4">
                  <div className="relative leading-[150%] font-medium inline-block min-w-[48px] whitespace-nowrap">
                    上一页
                  </div>
                </div>
                <div className="w-[70px] rounded-lg bg-whitesmoke-200 shrink-0 flex flex-row items-start justify-start py-2 px-4 box-border">
                  <div className="flex-1 relative leading-[150%] font-medium whitespace-nowrap">
                    ？/？
                  </div>
                </div>
                <div className="rounded-lg bg-whitesmoke-200 flex flex-row items-start justify-start py-2 px-4">
                  <div className="relative leading-[150%] font-medium inline-block min-w-[48px] whitespace-nowrap">
                    下一页
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[421px] flex flex-col items-start justify-start gap-[31px] min-w-[421px] max-w-full mq750:min-w-full mq450:gap-[15px] mq1125:flex-1">
        <img
          className="self-stretch h-[437px] relative rounded-71xl max-w-full overflow-hidden shrink-0 object-cover"
          loading="lazy"
          alt=""
          src="/hero-image@2x.png"
        />
        <div className="self-stretch flex flex-col items-start justify-start gap-[24px]">
          <h1 className="m-0 self-stretch h-[77px] relative text-inherit tracking-[-0.02em] font-bold font-inherit inline-block mq1050:text-32xl mq450:text-19xl">
            昵称
          </h1>
          <h3 className="m-0 self-stretch relative text-5xl leading-[150%] font-normal font-inherit text-gray-100 mq450:text-lgi mq450:leading-[29px]">
            <p className="m-0">ID:</p>
            <p className="m-0">&nbsp;</p>
            <p className="m-0">简介</p>
            <p className="m-0">&nbsp;</p>
            <p className="m-0">邮箱</p>
          </h3>
        </div>
      </div>
    </section>
  );
};

ProfileContent.propTypes = {
  className: PropTypes.string,
};

export default ProfileContent;
