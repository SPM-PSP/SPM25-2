"use client";
import React, { useState } from "react";
import useUserStore from "@/lib/useUserStore";
import Image from "next/image";
import supabase from "@/lib/supabase";

// Define the User interface
interface User {
  email: string;
  u_name: string;
  password: string;
  signature: string;
}

export default function Home() {
  const { setUser, user, logout } = useUserStore();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    if (!user) {
      setError("用户信息不存在，无法保存。");
      setIsSaving(false);
      return;
    }

    try {
      // Update user information in the database
      const { data, error } = await supabase
        .from("user")
        .update({
          u_name: user.u_name,
          password: user.password,
          signature: user.signature,
        })
        .eq("email", user.email);

      if (error) {
        throw error;
      }

      // Update local user state
      setUser({
        ...user,
        u_name: user.u_name,
        password: user.password,
        signature: user.signature,
      });

      alert("信息更新成功！");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "更新失败，请稍后再试。";
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-5 min-h-screen">
      <div className="flex flex-col items-center w-full max-w-[600px] mt-[50px]">
        {/* Avatar */}
        <div className="mb-[30px]">
          <Image
            src="/head.png"
            alt="Head"
            width={150}
            height={150}
            quality={100}
            priority={true}
            className="rounded-full border-[3px] border-[#ff69b4]"
          />
        </div>

        {/* User Info Form */}
        <form
          onSubmit={handleSave}
          className="bg-[rgba(50,50,70,0.8)] p-5 rounded-[10px] w-full max-w-[400px]"
        >
          <div className="mb-5">
            <label className="block mb-2 text-white font-bold">Email</label>
            <input
              type="text"
              value={user?.email || ""}
              disabled
              className="w-full p-[10px] border-none rounded-[5px] bg-white text-sm"
            />
          </div>
          <div className="mb-5">
            <label className="block mb-2 text-white font-bold">用户名</label>
            <input
              type="text"
              value={user?.u_name || ""}
              onChange={(e) =>
                user && setUser({ ...user, u_name: e.target.value })
              }
              className="w-full p-[10px] border-none rounded-[5px] bg-white text-sm"
            />
          </div>
          <div className="mb-5">
            <label className="block mb-2 text-white font-bold">密码</label>
            <input
              type="password"
              value={user?.password || ""}
              onChange={(e) =>
                user && setUser({ ...user, password: e.target.value })
              }
              className="w-full p-[10px] border-none rounded-[5px] bg-white text-sm"
            />
          </div>
          <div className="mb-5">
            <label className="block mb-2 text-white font-bold">个人简介</label>
            <input
              type="text"
              value={user?.signature || ""}
              onChange={(e) =>
                user && setUser({ ...user, signature: e.target.value })
              }
              className="w-full p-[10px] border-none rounded-[5px] bg-white text-sm"
            />
          </div>
          <button
            type="submit"
            className="bg-[#ff69b4] text-white border-none py-[10px] px-5 text-base cursor-pointer rounded-[5px] hover:bg-[#ff1493] transition-colors duration-300 mt-[10px]"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
}
