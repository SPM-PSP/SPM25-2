"use client";
import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { useSearchParams } from 'next/navigation';
import './page.css';
import supabase from '@/lib/supabase';

// 定义游戏数据接口
interface Game {
    g_id: number;
    g_name: string;
    g_time: string;
    face_img: string;
    style: string;
}

const Home = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Game[]>([]);
    const searchParams = useSearchParams();
    const [prevQuery, setPrevQuery] = useState('');

    const handleSearch = useCallback(async (query: string) => {
        setSearchResults([]);
        if (query.trim() === '') {
            return;
        }
        try {
            const { data, error } = await supabase
                .from('game')
                .select('*')
                .ilike('g_name', `%${query}%`)
                .throwOnError();

            setSearchResults(data || []);
        } catch (error) {
            console.error('搜索出错:', error);
        }
    }, []);

    useEffect(() => {
        const query = searchParams.get('query') || '';
        if (query !== prevQuery) {
            setSearchQuery(query);
            setPrevQuery(query);
            handleSearch(query);
        }
    }, [searchParams, handleSearch, prevQuery]);

    return (
        <>
            <Head>
                <meta charSet="UTF-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>游戏搜索结果</title>
            </Head>
            <div className="searchPage">
                <div className="search-results-container">
                    {searchResults.map((game) => (
                        <div key={game.g_id} className="game-item">
                            <img
                                src={game.face_img}
                                alt={game.g_name}
                                className="game-cover"
                            />
                            <div className="game-description">
                                <div className="left-content">
                                    <h3 className="game-name">{game.g_name}</h3>
                                    <div className="style-container">
                                        {game.style.split('，').map((styleItem, index) => (
                                            <div key={index} className="style-box">
                                                {styleItem}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <p className="game-time">{game.g_time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );

};

export default Home;