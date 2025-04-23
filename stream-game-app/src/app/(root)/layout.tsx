"use client";
import React, { useState } from "react";
import Image from "next/image";
import useUserStore from "@/lib/useUserStore";
import { useRouter, usePathname, redirect } from "next/navigation";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const { setUser, user, logout } = useUserStore();
  const router = useRouter();
  const currentPath = usePathname(); // 返回当前路径
  const [searchQuery, setSearchQuery] = useState("");
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
      logout();
      router.push("/login");
    }
  };
  // 处理搜索提交的函数
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // 跳转到搜索结果页面，并携带搜索关键词
      router.push(`/searchPage?query=${encodeURIComponent(searchQuery)}`);
    }
  };
  return (
    <div className="relative h-screen overflow-hidden">
      {/* 背景图片容器 */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/root_background.jpg"
          alt="Background"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </div>
      {/* 前景内容 */}
      <div style={{ position: "relative", zIndex: 1 }} className="px-10 w-full">
        {/* 占位符防止内容重叠 */}
        <div className="h-16"></div>
        {/* 顶部栏 */}
        <div className="w-full top-0 right-0 left-0 fixed flex bg-gradient-to-r from-black/60 to-transparent justify-between backdrop-blur-sm items-center p-4 z-50">
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
            {/* 添加表单和事件处理 */}
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                placeholder="搜索"
                className="bg-white/50 text-white px-4 py-2 rounded-lg w-150"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
          {/* 右侧：用户名和通知图标 */}
          <div className="flex items-center space-x-6">
            <span className="text-white text-2xl">{user?.u_name}</span>
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
          <div className="fixed left-0 top-20 bottom-0 z-40 w-57 px-8 py-4 flex justify-end">
            <nav>
              <ul>
                {navItems.map((item) => (
                  <li key={item.href} className="mb-12 relative">
                    {currentPath === item.href && (
                      <span className="absolute left-0 top-0 w-3 h-full bg-orange-400 rounded-1-md" />
                    )}
                    <a
                      href={item.href}
                      className={`block w-full px-6 py-3 text-2xl transition-colors duration-200 ${
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
          {/* 可滚动内容区域 */}
          <div className="flex-grow ml-45 h-[calc(100vh-5rem)] overflow-y-auto">
            <div className="min-h-full">
              <div className="rounded-xl p-6">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProtectedLayout;
