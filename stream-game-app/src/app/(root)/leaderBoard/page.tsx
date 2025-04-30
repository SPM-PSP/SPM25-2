"use client";
import useUserStore from "@/lib/useUserStore";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase";

// 定义 Game 接口，包含所有可能的字段
interface Game {
  g_id: number;
  g_name: string;
  g_time: Date;
  Description: string;
  face_img: string;
  style: string;
  avg_rating: number | null; // 支持 null 值
  tags?: string[]; // 可选的 tags 数组
}

export default function Home() {
  const { user, logout } = useUserStore(); // 用户状态
  const [games, setGames] = useState<Game[]>([]); // 存储游戏数据
  const [loading, setLoading] = useState(false); // 是否正在加载
  const [rankingTitle, setRankingTitle] = useState("高分榜");
  const [activeButton, setActiveButton] = useState("玩家评分");
  const [isHydrated, setIsHydrated] = useState(false); // 确保客户端和服务端渲染一致
  const router = useRouter(); // 使用 useRouter 钩子

  // 获取游戏数据，按指定字段排序
  const fetchGames = async (orderBy: string) => {
    setLoading(true);
    const { data: gamesData, error } = await supabase.from("game").select("*");

    if (error) {
      console.error("Error fetching games:", error);
      setLoading(false);
      return;
    }

    const { data: ratingsData, error: ratingsError } = await supabase
      .from("game")
      .select("g_id, avg_rating");

    if (ratingsError) {
      console.error("Error fetching ratings:", ratingsError);
      setLoading(false);
      return;
    }

    const mergedData = gamesData.map((game) => {
      const rating =
        ratingsData.find((r) => r.g_id === game.g_id)?.avg_rating || 0;
      return {
        ...game,
        avg_rating: rating, // 更新 avg_rating
        tags: game.style ? game.style.split("，") : [], // 分割 style 为 tags
      };
    });

    if (orderBy === "rating") {
      mergedData.sort((a, b) => (b.avg_rating || 0) - (a.avg_rating || 0));
    } else if (orderBy === "g_time") {
      mergedData.sort(
        (a, b) => new Date(b.g_time).getTime() - new Date(a.g_time).getTime()
      );
    }

    setGames(mergedData);
    setLoading(false);
  };

  // 组件挂载时加载数据
  useEffect(() => {
    setIsHydrated(true);
    fetchGames("rating"); // 默认按评分排序
  }, []);

  // 处理标题和按钮切换
  const handleTitleChange = (title: string, button: string) => {
    setRankingTitle(title);
    setActiveButton(button);
    if (button === "玩家评分") {
      fetchGames("rating");
    } else if (button === "发售时间") {
      fetchGames("g_time");
    }
  };

  // 处理点击事件，跳转到游戏详情页
  const handleClick = (game: Game) => {
    return () => {
      router.push(`/gameDetail/${game.g_id}`);
    };
  };

  // 未完成 hydration 时不渲染
  if (!isHydrated) {
    return null;
  }

  return (
    <div>
      {/* 顶部栏 */}
      <div className="w-full p-4 text-white flex justify-start space-x-6">
        <div
          className={`py-2 px-4 hover:bg-gray-500 cursor-pointer rounded ${
            activeButton === "玩家评分"
              ? "bg-gray-600 text-xl font-bold"
              : "text-base font-normal"
          }`}
          onClick={() => handleTitleChange("高分榜", "玩家评分")}
        >
          玩家评分
        </div>
        <div
          className={`py-2 px-4 hover:bg-gray-500 cursor-pointer rounded ${
            activeButton === "发售时间"
              ? "bg-gray-600 text-xl font-bold"
              : "text-base font-normal"
          }`}
          onClick={() => handleTitleChange("最新上线", "发售时间")}
        >
          发售时间
        </div>
      </div>

      {/* 主内容区域 */}
      <main className="w-full p-4 bg-[#0f0f1a] text-white">
        <div className="flex justify-between mb-4 px-4 items-center text-base font-normal">
          <h2 className="text-xl flex-1">{rankingTitle}</h2>
          <div className="w-1/6 text-right" style={{ marginRight: "-2rem" }}>
            <span>发售时间</span>
          </div>
          <div className="w-1/6 text-right" style={{ marginRight: "0.5rem" }}>
            <span>评分</span>
          </div>
        </div>
        <ul>
          {loading ? (
            <li className="flex justify-center items-center py-2 px-4">
              <p className="text-white">加载中...</p>
            </li>
          ) : (
            games.map((game, index) => (
              <li
                key={index}
                className="flex items-center justify-between py-2 px-4 bg-[#2a1a3a] rounded mb-2 hover:bg-[#3b2a4a] transition duration-300 cursor-pointer"
                onClick={handleClick(game)}
              >
                <span className="w-8 text-left text-base font-normal">
                  {index + 1}
                </span>
                <div className="w-48 h-24 mr-4 flex-shrink-0">
                  <img
                    src={game.face_img}
                    alt={game.g_name}
                    className="w-full h-full object-cover"
                    onClick={handleClick(game)}
                  />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <span className="text-xl font-bold mb-1">{game.g_name}</span>
                  <div className="flex flex-wrap">
                    {game.tags?.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="text-sm text-gray-400 bg-gray-900 bg-opacity-50 rounded px-2 py-1 mr-2 mt-1"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div
                  className="w-1/6 text-center"
                  style={{ marginRight: "-5.5rem" }}
                >
                  <span className="text-base font-normal">
                    {new Date(game.g_time).toLocaleDateString()}
                  </span>
                </div>
                <div
                  className="w-1/6 text-right"
                  style={{ marginRight: "1rem" }}
                >
                  <span
                    className="text-base font-normal"
                    style={{ color: "rgb(233, 234, 49)" }}
                  >
                    {game.avg_rating ?? 0}
                  </span>
                </div>
              </li>
            ))
          )}
        </ul>
      </main>
    </div>
  );
}
