import React from "react";
import Image from "next/image";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      {/* 背景图片 */}
      <Image
        src="/auth_background.jpg"
        alt="Background"
        layout="fill"
        objectFit="cover"
        quality={100}
        priority={true}
      />
      {/* 前景内容 */}
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
};

export default Layout;
