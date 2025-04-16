"use client";
import React from "react";
import "./Home.css"; // 引入CSS文件
import useUserStore from "@/lib/useUserStore";
import Image from "next/image";



export default function Home() {
  const { setUser, user, logout } = useUserStore();
  return (
    <div className="layout">
 
      {/* 主内容区域 */}
      <div className="content">
        <div className="user-profile">
          {/* 头像 */}
          <div className="avatar-container">
            <Image
              src="/head.png"
              alt="Head"
              width={150} // 指定宽度
              height={150} // 指定高度
              quality={100}
              priority={true}
            />
          </div>

          {/* 用户信息表单 */}
          <div className="user-form">
          <div className="form-group">
              <label>Email</label>
              <input type="text" placeholder={user?.email}/>
            </div>
            <div className="form-group">
              <label>用户名</label>
              <input type="text" placeholder={user?.u_name}/>
            </div>
            <div className="form-group">
              <label>密码</label>
              <input type="password" placeholder={user?.password}/>
            </div>
            <div className="form-group">
              <label>个人简介</label>
              <input type="text" placeholder={user?.signature}/>
            </div>
            <button className="save-button">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}
