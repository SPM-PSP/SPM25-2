import React from "react";
import Image from "next/image";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      {/* 背景图片 */}
      <Image
        src="/root_background.jpg"
        alt="Background"
        fill={true} // 使用新的 fill 布局策略
        style={{ objectFit: "cover" }} // 直接在 style 中设置 objectFit
        priority={true}
      />
      {/* 前景内容 */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <h1 className="text-3xl text-white">NavBar</h1>
        {children}
      </div>
    </div>
  );
};

export default Layout;
