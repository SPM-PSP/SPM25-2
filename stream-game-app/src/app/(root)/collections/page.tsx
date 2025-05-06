"use client";
import React, { useState, useEffect, DragEvent } from "react";
import "./Home.css"; // 引入CSS文件
import { createClient } from "@supabase/supabase-js";
import useUserStore from "@/lib/useUserStore";
import { useRouter } from "next/navigation";

// 初始化 Supabase 客户端
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const { user } = useUserStore();
  const [games, setGames] = useState<any[]>([]);
  const [dragItem, setDragItem] = useState<any>(null);
  const [dragOverItem, setDragOverItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter(); // 使用 useRouter 钩子

  // 获取收藏的游戏数据
  useEffect(() => {
    if (!user?.u_id) {
      setError("未登录用户无法查看收藏");
      setLoading(false);
      return;
    }

    const fetchCollectionGames = async () => {
      try {
        setLoading(true);
        setError(null);

        // 从 collections 表中获取该用户的游戏 ID 列表
        const { data: collectionData, error: collectionError } = await supabase
          .from("collections")
          .select("g_ids")
          .eq("u_id", user.u_id)
          .single(); // 假设一个用户只有一个收藏记录

        if (collectionError) {
          throw collectionError;
        }

        if (!collectionData || !collectionData.g_ids) {
          throw new Error("该用户没有收藏的游戏");
        }

        const gameIds = collectionData.g_ids.split("---"); // 假设 g_ids 是用 "---" 分隔的字符串

        // 过滤掉无效的值，并转换为数字
        const validGameIds = gameIds
          .map(id => parseInt(id))
          .filter(id => !isNaN(id));

        if (validGameIds.length === 0) {
          throw new Error("该用户没有收藏的游戏");
        }

        // 从 game 表中获取这些游戏的详细信息
        const { data: gameData, error: gameError } = await supabase
          .from("game")
          .select("*")
          .in("g_id", validGameIds);

        if (gameError) {
          throw gameError;
        }

        // 按照 validGameIds 的顺序对游戏进行排序
        const orderedGames = validGameIds
          .map(id => gameData.find(game => game.g_id === id))
          .filter(game => game !== undefined);

        setGames(orderedGames);
      } catch (err) {
        setError(err.message || "获取收藏游戏失败，请稍后再试。");
      } finally {
        setLoading(false);
      }
    };

    fetchCollectionGames();
  }, [user?.u_id]);

  const handleDragStart = (e: DragEvent<HTMLDivElement>, game: any) => {
    setDragItem(game);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>, game: any) => {
    e.preventDefault();
    setDragOverItem(game);
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!dragItem || !dragOverItem) return;

    const newGames = [...games];
    const dragIndex = newGames.findIndex(g => g.g_id === dragItem.g_id);
    const overIndex = newGames.findIndex(g => g.g_id === dragOverItem.g_id);

    if (dragIndex !== -1 && overIndex !== -1 && dragIndex !== overIndex) {
      // 交换两个游戏的位置
      const temp = newGames[dragIndex];
      newGames[dragIndex] = newGames[overIndex];
      newGames[overIndex] = temp;

      setGames(newGames);

      // 更新 collections 表中的 g_ids 顺序
      const updateCollectionOrder = async () => {
        try {
          const newGameIds = newGames.map(game => game.g_id).join("---");
          const { error } = await supabase
            .from("collections")
            .update({ g_ids: newGameIds })
            .eq("u_id", user.u_id);

          if (error) {
            console.error("更新收藏顺序失败:", error);
          }
        } catch (err) {
          console.error("更新收藏顺序失败:", err);
        }
      };

      updateCollectionOrder();
    }

    setDragItem(null);
    setDragOverItem(null);
  };

  const handleDragEnd = () => {
    setDragItem(null);
    setDragOverItem(null);
  };

  // 处理点击事件，跳转到游戏详情页
  const handleClick = (game: any) => {
    return () => {
      router.push(`/gameDetail/${game.g_id}`);
    };
  };

  return (
    <div className="content">
      <div className="center-image">
        {/* 游戏卡片列表 */}
        <div className="game-list">
          {loading ? (
            <div className="loading-message">正在加载收藏游戏数据...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : games.length === 0 ? (
            <div className="empty-message">您还没有收藏任何游戏。</div>
          ) : (
            games.map((game, index) => (
              <div
                key={game.g_id}
                className="game-card"
                draggable
                onDragStart={(e) => handleDragStart(e, game)}
                onDragOver={(e) => handleDragOver(e, game)}
                onDrop={(e) => handleDrop(e)}
                onDragEnd={handleDragEnd}
                style={
                  dragItem?.g_id === game.g_id
                    ? { opacity: 0.5, backgroundColor: "#2a1a3a" }
                    : dragOverItem?.g_id === game.g_id
                    ? { backgroundColor: "#3a2a4a" }
                    : {}
                }
                onClick={handleClick(game)} // 添加点击事件
              >
                <div className="game-rank">{index + 1}</div>
                <div className="game-image">
                  {/* 假设 face_img 字段存储的是图片的 URL */}
                  <img src={game.face_img} alt={game.g_name} width={250} height={140} />
                </div>
                <div className="game-details">
                  <h3>{game.g_name}</h3>
                  <div className="game-tags-container">
                    {game.style.split("，").map((tag, tagIndex) => (
                      <span key={tagIndex} className="game-tag">{tag}</span>
                    ))}
                  </div>
                  <p className="release-date">发行日期: {game.g_time}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}