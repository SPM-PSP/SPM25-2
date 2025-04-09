import React from 'react';
import './Home.css'; // 引入CSS文件
import Image from "next/image";

export default function Home() {
  return (
    <div className="container">
      <h1 className="text-white">user</h1>
      {/* 背景图片 */}
      <Image
        src="/head.png"
        alt="Head"
        width={300} // 指定宽度
        height={300} // 指定高度
        quality={100}
        priority={true}
      />
       <button className="save-button">
        Save
      </button>
    </div>
  );
}