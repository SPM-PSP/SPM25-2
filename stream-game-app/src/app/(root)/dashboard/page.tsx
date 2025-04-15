"use client";
import Link from "next/link";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import "./dashboard.css";

const images = [
  "/auth_background.jpg",
  "/logo-root.png",
  "/head.png",
  "/root_background.jpg",
];

export default function Home() {
  //图片轮播功能(未设置样式)
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);
  //图片轮播功能(未设置样式)
  return (
    <div>
      {/*图片轮播功能(未设置样式)*/}
      <div className="relative h-96 overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((src, index) => (
            <div key={index} className="relative min-w-full h-96">
              <Image
                src={src}
                alt={`Slide ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
        {/* 指示点 */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentIndex ? "bg-blue-500" : "bg-white"
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
      {/*图片轮播功能(未设置样式)*/}

      <h1 className="text-white">（占位）强烈推荐</h1>
      <div>
        <h1 className="text-white">（占位）表格</h1>
      </div>
      <h1 className="text-white">dashboard</h1>

      <ul className="mt-10 text-white">
        <li>
          <Link href="/gameDetail/1">game 1</Link>
        </li>
        <li>
          <Link href="/gameDetail/2">game 2</Link>
        </li>
        <li>
          <Link href="/gameDetail/3">game 3</Link>
        </li>
        <li>
          <Link href="/gameDetail/4">game 4</Link>
        </li>
      </ul>
    </div>
  );
}
