import React from "react";
import Form from "next/Form";

const LoginForm = () => {
  return (
    <div className="fixed max-w-[450px] w-full h-full flex items-center justify-center">
      <div className="bg-white/50  backdrop-blur-xs p-8 rounded-[15px] shadow-[0_0_25px_rgba(255,255,255,0.6)] w-full">
        <Form action="">
          <div className="mb-2 flex justify-between">
            <label htmlFor="username" className="text-l">
              用户名
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
            id="username"
            placeholder="请输入用户名"
            className="w-full p-2 border border-gray-100 bg-white opacity-75 h-auto rounded-lg mb-4 focus:outline-none focus:border-blue-500"
          />
          <div className="mb-2 flex justify-between">
            <label htmlFor="password" className="text-l">
              密码
            </label>
          </div>
          <input
            type="password"
            id="password"
            placeholder="请输入密码"
            className="w-full p-2 border border-gray-100 bg-white opacity-75 h-auto rounded-lg mb-4 focus:outline-none focus:border-blue-500"
          />
          <button className="mt-5 w-full p-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600">
            登 录
          </button>
        </Form>
      </div>
    </div>
  );
};

export default LoginForm;
