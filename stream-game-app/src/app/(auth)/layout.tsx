import React from "react";
import Image from "next/image";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      {/* 背景图片 */}
      <Image
        src="/auth_background.jpg"
        alt="Background"
        fill={true} // 使用新的 fill 布局策略
        style={{ objectFit: "cover" }} // 直接在 style 中设置 objectFit
        priority={true}
      />
      {/* 前景内容 */}
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
};

export default Layout;
