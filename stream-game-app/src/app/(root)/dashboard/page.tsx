"use client";
import Link from "next/link";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Carousel from "@/components/dashboard/carousel/carousel" ;

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
  return (
    <div>
      {/*图片轮播功能(未设置样式)*/}
      <div>
        <Carousel>
        </Carousel>
      </div>
      
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
    </div>
  );
}
