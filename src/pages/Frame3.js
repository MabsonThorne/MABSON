import React from "react";
import { useParams } from "react-router-dom";
import FrameComponent4 from "../components/FrameComponent4";
import ProfileContent from "../components/ProfileContent";
import FrameComponent6 from "../components/FrameComponent6";

const Frame3 = () => {
  const { id } = useParams(); // 从URL中获取id

  return (
    <div className="w-full relative bg-white overflow-hidden flex flex-col items-center justify-start pt-[46px] pb-12 box-border gap-[88px] leading-[normal] tracking-[normal] text-left text-45xl text-text-primary font-small-text">
      <FrameComponent4 />
      <main className="self-stretch flex flex-col items-start justify-start gap-[30px] max-w-full w-full">
        <ProfileContent id={id} /> {/* 将id传递给ProfileContent */}
        <FrameComponent6 />
      </main>
    </div>
  );
};

export default Frame3;
