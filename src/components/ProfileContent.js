import Card1 from "./Card1";
import PropTypes from "prop-types";

const ProfileContent = ({ className = "" }) => {
  return (
    <section
      className={`w-[1279px] flex flex-row items-end justify-start gap-[95px] max-w-full text-left text-45xl text-black font-small-text mq750:gap-[47px] mq450:gap-[24px] mq1125:flex-wrap ${className}`}
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
              <div className="rounded-xl bg-whitesmoke overflow-x-auto flex flex-row items-start justify-start p-2 gap-[8px]">
                <div className="rounded-lg bg-whitesmoke flex flex-row items-start justify-start py-2 px-4">
                  <div className="relative leading-[150%] font-medium inline-block min-w-[48px] whitespace-nowrap">
                    上一页
                  </div>
                </div>
                <div className="w-[70px] rounded-lg bg-whitesmoke shrink-0 flex flex-row items-start justify-start py-2 px-4 box-border">
                  <div className="flex-1 relative leading-[150%] font-medium whitespace-nowrap">
                    ？/？
                  </div>
                </div>
                <div className="rounded-lg bg-whitesmoke flex flex-row items-start justify-start py-2 px-4">
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
          <h3 className="m-0 self-stretch relative text-5xl leading-[150%] font-normal font-inherit text-gray mq450:text-lgi mq450:leading-[29px]">
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

export default ProfileContent;图片那里改为按钮，也是悬停的时候有阴影效果，不悬停没有，图片弄个加载动画，加载动画就是在图片按钮中间一个红色的圆转圈，动画合并到这个文件里，根据url的id从数据库找头像图片然后显示，然后下面的昵称、ID、简介和邮箱也是根据采集的信息展示，然后邮箱下面加一个红色的编辑按钮，这个组件会检测目前登录的用户id的url的id是否一致，一致才会出现红色编辑按钮，点击编辑按钮后，进入编辑模式，进入编辑模式后编辑按钮变为完成按钮，点击图片按钮才可以重复上传并预览头像，否则没有进入编辑模式点击头像按钮只能把图片放大出来查看，点击后图片变回原样，然后在编辑模式简介和昵称都是可以改的，更改完后点击完成按钮后更新数据库信息，只有更新成功后数据库内容匹配才能退出编辑模式，完成按钮变成编辑按钮并重新加载网页，这样新改的内容就会重新展示，错误信息在控制台展示
