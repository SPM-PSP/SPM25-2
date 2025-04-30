"use client";
import React, { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import { useSearchParams } from "next/navigation";
import supabase from "@/lib/supabase";

// 定义游戏数据接口
interface Game {
  g_id: number;
  g_name: string;
  g_time: string;
  face_img: string;
  style: string;
}

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const [prevQuery, setPrevQuery] = useState("");

  const handleSearch = useCallback(async (query: string) => {
    setSearchResults([]);
    setError(null);
    if (query.trim() === "") {
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("game")
        .select("*")
        .ilike("g_name", `%${query}%`)
        .throwOnError();

      if (error) {
        throw error;
      }
      setSearchResults(data || []);
    } catch (error: any) {
      setError(error.message || "搜索出错，请稍后再试。");
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

  return (
    <>
      <div className="min-h-screen text-white p-4">
        <div className="w-full">
          {loading && (
            <div className="text-center text-gray-400 text-lg">
              正在加载搜索结果...
            </div>
          )}
          {error && (
            <div className="text-center text-red-500 text-lg">{error}</div>
          )}
          {searchResults.length === 0 && !loading && !error && (
            <div className="text-center text-gray-400 text-lg">
              没有找到匹配的游戏。
            </div>
          )}
          {searchResults.map((game, index) => (
            <div
              key={game.g_id}
              className="bg-[#2a1a3a] rounded-lg p-4 mb-4 flex items-center border border-gray-700 transition duration-200"
            >
              <div className="game-rank text-center text-xl font-bold text-gray-300">
                {index + 1}
              </div>
              <div className="game-image w-[250px] h-[140px] mr-4 flex-shrink-0">
                <img
                  src={game.face_img}
                  alt={game.g_name}
                  width={250}
                  height={140}
                />
              </div>
              <div className="game-details flex-1">
                <h3 className="text-xl font-bold mb-2 text-white">
                  {game.g_name}
                </h3>
                <p className="game-style text-sm text-gray-400 mb-1">
                  风格: {game.style}
                </p>
                <p className="release-date text-base text-gray-300">
                  发行日期: {game.g_time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
