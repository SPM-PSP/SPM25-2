"use client";
import React from "react";

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="spinner"></div>
      <style jsx>{`
        .spinner {
          border: 4px solid #f3f3f3; /* 背景边框颜色 */
          border-top: 4px solid #3498db; /* 旋转部分的颜色 */
          border-radius: 50%; /* 圆形 */
          width: 100px; /* 宽度 */
          height: 100px; /* 高度 */
          animation: spin 1s linear infinite; /* 动画名称、持续时间、线性运行、无限循环 */
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          } /* 开始时角度为0 */
          100% {
            transform: rotate(360deg);
          } /* 结束时旋转一圈 */
        }
      `}</style>
    </div>
  );
};

export default Loading;
