"use client";
import React, { useState, useEffect } from "react";
import "./Home.css"; // 引入CSS文件
import { createClient } from "@supabase/supabase-js";
import useUserStore from "@/lib/useUserStore";

// 初始化 Supabase 客户端
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const { user } = useUserStore();
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 获取游戏数据
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const { data, error } = await supabase
          .from("game")
          .select("*")
          .order("g_id", { ascending: true });

        if (error) {
          throw error;
        }
        setGames(data || []);
      } catch (err) {
        setError(err.message || "获取游戏列表失败，请稍后再试。");
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  return (
    <div className="content">
      <div className="center-image">
        {/* 游戏卡片列表 */}
        <div className="game-list">
          {loading ? (
            <div className="loading-message">正在加载游戏数据...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            games.map((game) => (
              <div className="game-card" key={game.g_id}>
                <div className="game-rank">{game.g_id}</div>
                <div className="game-image">
                  {/* 假设 face_img 字段存储的是图片的 URL */}
                  <img src={game.face_img} alt={game.g_name} width={200} height={100} />
                </div>
                <div className="game-details">
                  <h3>{game.g_name}</h3>
                  <p className="game-style">风格: {game.style}</p>
                  <p className="game-tags">{game.g_desc}</p>
                  <p className="release-date">发行日期: {game.g_time}</p>
                </div>
                <div className="favorite-btn">❤</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}