"use client";

import Link from 'next/link';
import useUserStore from "@/lib/useUserStore";
import useGameStore from "@/lib/useGameStore";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // 从 next/navigation 导入 useRouter
import supabase from '@/lib/supabase';

export default function Home() {
  const { user, logout } = useUserStore();  /* 用户状态 */
  const { game, setGame, exit } = useGameStore();  /* 游戏状态 */
  const [rankingTitle, setRankingTitle] = useState("高分榜");
  const [activeButton, setActiveButton] = useState("玩家评分");
  const [games, setGames] = useState<Game[]>([]); // 存储游戏数据
  const [loading, setLoading] = useState(false);  // 是否正在加载
  const [isHydrated, setIsHydrated] = useState(false); // 用于确保客户端渲染和服务端渲染一致
  const router = useRouter(); // 使用 useRouter 钩子

  interface Game {
    g_id: number;
    g_name: string;
    g_time: string;
    style: string;
    avg_rating?: number; // 可选属性
    tags?: string[]; // 可选属性
  }

  const fetchGames = async (orderBy:any) => {
    setLoading(true);
    
    let { data: gamesData, error } = await supabase
        .from('game')
        .select('*');
    
    if (!gamesData) {
      console.error('gamesData is null or undefined');
      setLoading(false);
      return;
    }  

    if (error) {
        console.error('Error fetching games:', error);
        setLoading(false);
        return;
    }

    const { data: ratingsData, error: ratingsError } = await supabase
        .from('game')
        .select('g_id, avg_rating');

    if (ratingsError) {
        console.error('Error fetching ratings:', ratingsError);
        setLoading(false);
        return;
    }

    const mergedData = gamesData.map(game => {
        const rating = ratingsData.find(r => r.g_id === game.g_id)?.avg_rating || 0;
        return { ...game, rating, tags: game.style ? game.style.split('，') : [] }; // 分割标签
    });

    if (orderBy === 'rating') {
        mergedData.sort((a, b) => b.rating - a.rating);
    } else if (orderBy === 'g_time') {
        mergedData.sort((a, b) => new Date(b.g_time).getTime() - new Date(a.g_time).getTime());
    }

    setGames(mergedData);
    setLoading(false);
  };


  useEffect(() => {
    setIsHydrated(true);
    fetchGames('rating'); // 默认按评分排序
  }, []);

  const handleTitleChange = (title:any, button: '玩家评分' | '发售时间') => {
    setRankingTitle(title);
    setActiveButton(button);
    if (button === '玩家评分') {
        fetchGames('rating');
    } else if (button === '发售时间') {
        fetchGames('g_time');
    }
  };

  const handleClick = (game: any) => {
    return () => {
        setLoading(true);
        setGame(game); // 将点击的游戏设置为全局游戏状态
        router.push('/dashboard/GameDetail'); // 使用 useRouter 进行导航，传递游戏 ID
        console.log('被点击了:', game); // 输出更新后的游戏对象
    };
  };

  if (!isHydrated) {
    return null; // 确保组件在客户端渲染
  }

}