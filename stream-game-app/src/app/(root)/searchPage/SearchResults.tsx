// app/(root)/searchPage/SearchResults.tsx
"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import supabase from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface Game {
  g_id: number;
  g_name: string;
  g_time: string;
  face_img: string;
  style: string;
  tags?: string[];
}

export default function SearchResults() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const [prevQuery, setPrevQuery] = useState("");
  const router = useRouter();

  const handleSearch = useCallback(async (query: string) => {
    setSearchResults([]);
    setError(null);
    if (query.trim() === "") return;
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("game")
        .select("*")
        .ilike("g_name", `%${query}%`)
        .throwOnError();

      if (error) throw error;

      const processedData =
        data?.map((game) => ({
          ...game,
          tags: game.style
            ? game.style.split("，").filter((t: string) => t.trim())
            : [],
        })) || [];

      setSearchResults(processedData);
    } catch (err: any) {
      setError(err.message || "搜索失败");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const query = searchParams.get("query") || "";
    if (query !== prevQuery) {
      setSearchQuery(query);
      setPrevQuery(query);
      handleSearch(query);
    }
  }, [searchParams, handleSearch, prevQuery]);

  const handleClick = (game: Game) => () => {
    router.push(`/gameDetail/${game.g_id}`);
  };

  return (
    <div className="w-full p-4 text-white">
      {loading && (
        <div className="text-center text-gray-400 text-lg">
          正在加载搜索结果...
        </div>
      )}
      {error && <div className="text-center text-red-500 text-lg">{error}</div>}
      {searchResults.length === 0 && !loading && !error && (
        <div className="text-center text-gray-400 text-lg">
          没有找到匹配的游戏。
        </div>
      )}
      {searchResults.map((game, index) => (
        <div
          key={game.g_id}
          className="bg-[#2a1a3a] rounded-lg p-4 mb-4 flex items-center hover:bg-[#3b2a4a] transition duration-300 cursor-pointer"
          onClick={handleClick(game)}
        >
          <div className="game-rank text-center text-xl font-bold text-gray-300 mr-4">
            {index + 1}
          </div>
          <div className="w-48 h-24 mr-4 flex-shrink-0">
            <img
              src={game.face_img}
              alt={game.g_name}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <span className="text-lg mb-1">{game.g_name}</span>
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
            <p className="text-sm mt-2 text-[#ddd]">发行日期: {game.g_time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
