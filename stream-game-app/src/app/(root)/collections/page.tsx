import React from "react";
import "./Home.css"; // 引入CSS文件
import Image from "next/image";

export default function Home() {
  return (
    <div className="layout">
      {/* 侧边栏 */}
      <div className="sidebar">
        <ul>
          <li>游戏商城</li>
          <li className="active">我的收藏</li>
          <li>排行榜</li>
          <li>Stream AI</li>
          <li>账户管理</li>
        </ul>
      </div>

      {/* 主内容区域 */}
      <div className="content">
        <div className="center-image">
          <Image
            src="/collections.png"
            alt="Collections"
            width={3000}
            height={3000}
            quality={100}
            priority={true}
          />
        </div>
      </div>
    </div>
  );
}
