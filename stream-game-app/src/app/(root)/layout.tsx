"use client";
import React from "react";
import Image from "next/image";
import useUserStore from "@/lib/useUserStore";
import { useRouter, usePathname } from "next/navigation";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { setUser, user, logout } = useUserStore();
  const router = useRouter();
  const currentPath = usePathname(); // 返回当前路径

  // 定义导航项数据
  const navItems = [
    { label: "游戏商城", href: "/dashboard" },
    { label: "我的收藏", href: "/collections" },
    { label: "排行榜", href: "/leaderBoard" },
    { label: "Stream AI", href: "/StreamAI" },
    { label: "账户管理", href: "/user" },
  ];

  const handleLogout = () => {
    if (window.confirm("确认退出当前账户？")) {
      logout;
      router.push("/login");
    }
  };

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
      <div style={{ position: "relative", zIndex: 1 }} className="px-10">
        {/* 顶部栏 */}
        <div className="flex justify-between items-center p-4">
          {/* 左侧：Logo 和 搜索框 */}
          <div className="flex items-center space-x-15">
            <div className="flex items-center space-x-2">
              <img
                src="/logo-root.png"
                alt="Logo"
                className="w-15 h-15 rounded-full"
              />
              <span className="text-white text-2xl">STREAM</span>
            </div>
            <input
              type="text"
              placeholder="搜索"
              className="bg-white/50 text-white px-4 py-2 rounded-lg w-150"
            />
          </div>
          {/* 右侧：用户名和通知图标 */}
          <div className="flex items-center space-x-6">
            <span className="text-white text-2xl">{user?.email}</span>
            <img
              src="/logout.png"
              alt="logout"
              className="w-8 h-8 cursor-pointer"
              onClick={handleLogout}
            />
          </div>
        </div>
        {/* 侧边导航栏和主要内容区域 */}
        <div className="flex">
          {/* 侧边导航栏 */}
          <div className="w-57 px-8 py-4 flex justify-end">
            <nav>
              <ul>
                {navItems.map((item) => (
                  <li key={item.href} className="mb-12 relative">
                    {currentPath === item.href && (
                      <span className="absolute left-0 top-0 w-3 h-full bg-orange-400 rounded-1-md" />
                    )}
                    <a
                      href={item.href}
                      className={`block w-full px-8 py-3 text-2xl transition-colors duration-200 ${
                        currentPath === item.href
                          ? "text-orange-400"
                          : "text-white"
                      }`}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          {/* 主要内容区域 */}
          <div className="flex-grow p-4">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
