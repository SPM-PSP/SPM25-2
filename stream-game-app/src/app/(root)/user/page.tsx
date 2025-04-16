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
          <li>我的收藏</li>
          <li>排行榜</li>
          <li>Stream AI</li>
          <li className="account-management">账户管理</li>
        </ul>
      </div>

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
              <label>账号</label>
              <input type="text" placeholder="无敌原神大王" />
            </div>
            <div className="form-group">
              <label>密码</label>
              <input type="password" placeholder="**********" />
            </div>
            <div className="form-group">
              <label>个人简介</label>
              <input type="text" placeholder="原来你也玩原神！！！" />
            </div>
            <button className="save-button">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}
