"use client";
import Link from "next/link";

import React, { useState, useEffect } from "react";
import Image from "next/image";

const Game={
  g_id:"",
  face_img:"",
};
const getGameHeaderData=()=>{
  const game1=Object.create(Game);
  const game2=Object.create(Game);
  const game3=Object.create(Game);
  const game4=Object.create(Game);
  const array=new Array;

  game1.g_id="1";
  game1.face_img="/auth_background.jpg";
  array.push(game1);

  game2.g_id="2";
  game2.face_img="/logo-root.png";
  array.push(game2);

  game3.g_id="3";
  game3.face_img="/head.png";
  array.push(game3);

  game4.g_id="4";
  game4.face_img="/root_background.jpg";
  array.push(game4);

  return array;
}
const images=getGameHeaderData();
const getGameTableData=()=>{
  const array=new Array;
  for(var i=0;i<4;i++){
    const game1=Object.create(Game);
    const game2=Object.create(Game);
    const game3=Object.create(Game);
    const game4=Object.create(Game);

    game1.g_id=i*4+1;
    game1.face_img="/auth_background.jpg";
    array.push(game1);

    game2.g_id=i*4+2;
    game2.face_img="/logo-root.png";
    array.push(game2);

    game3.g_id=i*4+3;
    game3.face_img="/head.png";
    array.push(game3);

    game4.g_id=i*4+4;
    game4.face_img="/root_background.jpg";
    array.push(game4);
  }
  return array;
};
const gameArray=getGameTableData();

export default function Home() {
  //图片轮播功能(未设置样式)
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    //console.log(gameArray);
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
          {images.map((item, index) => (
            <div key={index} className="relative min-w-full h-96">
              <Link key={index} href={`/gameDetail/${item.g_id}`}>
              <Image
                src={item.face_img}
                alt={`Slide ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
              </Link>
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

      {/* 游戏推荐表格 */}
      <div className="relative h-96 overflow-hidden flex flex-row flex-wrap">
        {gameArray.map((item,index)=>(
          <div key={index} className="relative w-1/4 h-1/4 border-2">
            <Link key={index} href={`/gameDetail/${item.g_id}`}>
            <Image
              src={item.face_img}
              alt={`Slide ${index}`}
              fill
              className="object-cover"
              priority={true}
            />
            </Link>
          </div>
        ))}
      </div>
      {/* 游戏推荐表格 */}
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
