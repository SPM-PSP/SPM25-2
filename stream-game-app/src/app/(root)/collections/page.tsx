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

// 定义游戏对象的接口
interface Game {
  g_id: number;
  face_img: string;
  g_name: string;
  style: string;
  g_time: string;
}

// 定义收藏表的接口
interface Collection {
  g_ids: string;
}

export default function Home() {
  const { user } = useUserStore();
  const [games, setGames] = useState<Game[]>([]);
  const [dragItem, setDragItem] = useState<Game | null>(null);
  const [dragOverItem, setDragOverItem] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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

        const { data: collectionData, error: collectionError } = await supabase
          .from("collections")
          .select("g_ids")
          .eq("u_id", user.u_id)
          .single();

        if (collectionError) {
          throw collectionError;
        }

        if (!collectionData || !collectionData.g_ids) {
          throw new Error("该用户没有收藏的游戏");
        }

        const gameIds = (collectionData as Collection).g_ids.split("---");

        const validGameIds = gameIds
          .map((id: string) => parseInt(id))
          .filter((id: number) => !isNaN(id));

        if (validGameIds.length === 0) {
          throw new Error("该用户没有收藏的游戏");
        }

        const { data: gameData, error: gameError } = await supabase
          .from("game")
          .select("*")
          .in("g_id", validGameIds);

        if (gameError) {
          throw gameError;
        }

        const orderedGames = validGameIds
          .map((id: number) =>
            (gameData as Game[]).find((game: Game) => game.g_id === id)
          )
          .filter((game): game is Game => game !== undefined);

        setGames(orderedGames);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("获取收藏游戏失败，请稍后再试。");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCollectionGames();
  }, [user?.u_id]);

  const handleDragStart = (e: DragEvent<HTMLDivElement>, game: Game) => {
    setDragItem(game);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>, game: Game) => {
    e.preventDefault();
    setDragOverItem(game);
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!dragItem || !dragOverItem) return;

    const newGames = [...games];
    const dragIndex = newGames.findIndex((g) => g.g_id === dragItem.g_id);
    const overIndex = newGames.findIndex((g) => g.g_id === dragOverItem.g_id);

    if (dragIndex !== -1 && overIndex !== -1 && dragIndex !== overIndex) {
      const temp = newGames[dragIndex];
      newGames[dragIndex] = newGames[overIndex];
      newGames[overIndex] = temp;

      setGames(newGames);

      const updateCollectionOrder = async () => {
        try {
          const newGameIds = newGames.map((game) => game.g_id).join("---");
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

  const handleClick = (game: Game) => {
    return () => {
      router.push(`/gameDetail/${game.g_id}`);
    };
  };

  return (
    <div className="content">
      <div className="center-image">
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
                onClick={handleClick(game)}
              >
                <div className="game-rank">{index + 1}</div>
                <div className="game-image">
                  <img
                    src={game.face_img}
                    alt={game.g_name}
                    width={250}
                    height={140}
                  />
                </div>
                <div className="game-details">
                  <h3>{game.g_name}</h3>
                  <div className="game-tags-container">
                    {game.style
                      .split("，")
                      .map((tag: string, tagIndex: number) => (
                        <span key={tagIndex} className="game-tag">
                          {tag}
                        </span>
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
