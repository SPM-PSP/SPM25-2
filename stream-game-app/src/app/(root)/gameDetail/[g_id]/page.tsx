import React from "react";
import supabase from '@/lib/supabase';
import './page.css';
import MediaCarousel from '@/components/gameDetail/MediaCarousel';
import RatingComponent from '@/components/gameDetail/RatingComponent';
import FavoriteComponent from "@/components/gameDetail/FavoriteComponent";
import CommentComponent from "@/components/gameDetail/CommentComponent";
interface Game {
    g_id: number;
    g_name: string;
    img1: string;
    img2: string;
    img3: string;
    img4: string;
    video: string;
    face_img: string;
    Description: string;
    g_time: string;
    style: string;
}

export default async function Home({ params }: { params: { g_id: string } }) {
    const { g_id } = params;
    try {
        const { data, error } = await supabase
            .from('game')
            .select('*')
            .eq('g_id', parseInt(g_id))
            .single();

        if (error) {
            throw error;
        }

        const game = data as Game;
        const mediaItems = [
            game.img1,
            game.img2,
            game.img3,
            game.img4,
        ];

        return (
            <div className="game-detail-container">
                <div className="left-container">
                    <h1 className="game-name">{game.g_name}</h1>
                    <div className="game-media-carousel">
                        <MediaCarousel
                            images={mediaItems}
                            video={game.video}
                            autoPlay={true}
                            interval={5000}
                        />
                    </div>
                    <CommentComponent g_id={game.g_id} />
                </div>

                <div className="right-container">
                    <img src={game.face_img} alt="封面图" className="cover-image" />
                    <p className="game-description">{game.Description}</p>
                    <p><span className="info-label">发行时间：</span>{game.g_time}</p>
                    <p><span className="info-label">定位标签：</span>{game.style}</p>
                    <div className="mt-4 flex items-center space-x-4">
                        <RatingComponent g_id={game.g_id} />
                        <FavoriteComponent g_id={game.g_id}/>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('获取游戏详情出错:', error);
        return (
            <div className="p-4">
                <p className="text-red-500">抱歉，无法获取游戏详情。</p>
            </div>
        );
    }
}