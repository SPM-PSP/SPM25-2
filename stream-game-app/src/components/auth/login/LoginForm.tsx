"use client";
import React from "react";
import supabase from "@/lib/supabase";
import { useRouter } from "next/navigation";
import useUserStore from "@/lib/useUserStore";

const LoginForm = () => {
  const router = useRouter();
  const { setUser, user } = useUserStore(); /* 记录用户状态 */

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const email = form.elements.namedItem("email") as HTMLInputElement;
    const password = form.elements.namedItem("password") as HTMLInputElement;

    // 从数据库中查询是否存在该邮箱
    const { data, error } = await supabase
      .from("user")
      .select("*")
      .eq("email", email.value)
      .single();

    if (error || !data) {
      console.log("error: ", error);
      alert("账户不存在");
      return;
    }

    // 检查密码是否匹配
    if (data.password !== password.value) {
      alert("密码错误，请重新输入");
      return;
    }

    setUser({
      u_id: data.u_id,
      email: data.email,
      u_name: data.u_name,
      password: data.password,
      signature: data.signature,
    }); /* 设置用户信息 */
    router.push("/dashboard");
  };

  return (
    <div className="fixed max-w-[450px] w-full h-full flex items-center justify-center">
      <div className="bg-white/50  backdrop-blur-xs p-8 rounded-[15px] shadow-[0_0_25px_rgba(255,255,255,0.6)] w-full">
        <div className="mb-8 flex items-center justify-center">
          <img src="/logo-login.png" alt="logo" className="w-22 h-22" />
          <h1 className="text-3xl text-black">STREAM</h1>
        </div>
        <form onSubmit={handleLogin}>
          <div className="mb-2 flex justify-between">
            <label htmlFor="email" className="text-l text-black">
              邮箱
            </label>
            <a
              href="/register"
              className="text-l text-blue-700 hover:text-blue-800"
            >
              点此创建账户
            </a>
          </div>
          <input
            type="text"
            name="email"
            placeholder="请输入邮箱"
            className="text-black w-full p-2 border border-gray-100 bg-white opacity-75 h-auto rounded-lg mb-4 focus:outline-none focus:border-blue-500"
            required
          />
          <div className="mb-2 flex justify-between">
            <label htmlFor="password" className="text-l text-black">
              密码
            </label>
          </div>
          <input
            type="password"
            name="password"
            placeholder="请输入密码"
            className="text-black w-full p-2 border border-gray-100 bg-white opacity-75 h-auto rounded-lg mb-4 focus:outline-none focus:border-blue-500"
            required
          />
          <button
            type="submit"
            className="mt-5 w-full p-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
          >
            登 录
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
