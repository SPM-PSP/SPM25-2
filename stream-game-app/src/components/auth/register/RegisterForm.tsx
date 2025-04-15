"use client";
import React from "react";
import supabase from "@/lib/supabase";
import { useRouter } from "next/navigation";

const RegisterForm = () => {
  const router = useRouter();

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const email = form.elements.namedItem("email") as HTMLInputElement;
    const password = form.elements.namedItem("password") as HTMLInputElement;
    const password2 = form.elements.namedItem("password2") as HTMLInputElement;

    // 从数据库中查询该邮箱是否已注册
    const { data, error } = await supabase
      .from("user")
      .select("*")
      .eq("email", email.value)
      .maybeSingle();
    console.log(data);
    if (error || data) {
      console.log("error: ", error?.message);
      alert("该邮箱已被注册");
      return;
    }
    // 检查两次密码是否一致
    if (password.value !== password2.value) {
      alert("两次输入的密码不一致，请重新输入");
      return;
    }

    const { error: insertError } = await supabase
      .from("user")
      .insert({ email: email.value, password: password.value });
    if (insertError) {
      console.error("error: ", insertError.message);
      alert("注册失败，请稍后再试");
      return;
    }

    router.push("/login");
  };

  return (
    <div className="fixed max-w-[450px] w-full h-full flex items-center justify-center">
      <div className="bg-white/50  backdrop-blur-xs p-8 rounded-[15px] shadow-[0_0_25px_rgba(255,255,255,0.6)] w-full">
        <form onSubmit={handleRegister}>
          <div className="mb-2 flex justify-between">
            <label htmlFor="email" className="text-l text-black">
              邮箱
            </label>
            <a
              href="/login"
              className="text-l text-blue-700 hover:text-blue-800"
            >
              登录已有账户
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
          <div className="mb-2 flex justify-between">
            <label htmlFor="password" className="text-l text-black">
              密码
            </label>
          </div>
          <input
            type="password"
            name="password2"
            placeholder="请确认密码"
            className="text-black w-full p-2 border border-gray-100 bg-white opacity-75 h-auto rounded-lg mb-4 focus:outline-none focus:border-blue-500"
            required
          />
          <button
            type="submit"
            className="mt-5 w-full p-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
          >
            注 册
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
