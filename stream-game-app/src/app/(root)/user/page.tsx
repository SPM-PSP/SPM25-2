"use client";
import React, { useState } from "react";
import "./Home.css"; // 引入CSS文件
import useUserStore from "@/lib/useUserStore";
import Image from "next/image";
import supabase from "@/lib/supabase";

export default function Home() {
  const { setUser, user, logout } = useUserStore();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      // 更新用户信息到数据库
      const { data, error } = await supabase
        .from('user')
        .update({
          u_name: user.u_name,
          password: user.password,
          signature: user.signature
        })
        .eq('email', user.email);

      if (error) {
        throw error;
      }

      // 更新本地存储的用户信息
      setUser({
        ...user,
        u_name: user.u_name,
        password: user.password,
        signature: user.signature
      });

      alert("信息更新成功！");
    } catch (err) {
      setError(err.message || "更新失败，请稍后再试。");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="layout">
      <div className="content" style={{ paddingTop: '50px' }}>
        <div className="user-profile" style={{ marginTop: '50px' }}>
          {/* 头像 */}
          <div className="avatar-container">
            <Image
              src="/head.png"
              alt="Head"
              width={150}
              height={150}
              quality={100}
              priority={true}
            />
          </div>

          {/* 用户信息表单 */}
          <div className="user-form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="text"
                value={user?.email}
                disabled // 设置为只读
              />
            </div>
            <div className="form-group">
              <label>用户名</label>
              <input
                type="text"
                value={user?.u_name}
                onChange={(e) => setUser({ ...user, u_name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>密码</label>
              <input
                type="text"
                value={user?.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>个人简介</label>
              <input
                type="text"
                value={user?.signature}
                onChange={(e) => setUser({ ...user, signature: e.target.value })}
              />
            </div>
            <button
              className="save-button"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
            {error && <p className="error-message">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}