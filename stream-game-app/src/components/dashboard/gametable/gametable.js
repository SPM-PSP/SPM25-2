import supabase from "@/lib/supabase";
import { useEffect, useState } from "react";
import Link from "next/link";
export default function GameTable(){
    const [games, setGames] = useState([]);
    const fetchGames=async()=>{
        const { data, error } = await supabase
        .from("game")
        .select("*")
        .neq("g_id","1")
        .neq("g_id","12")
        .neq("g_id","13")
        .neq("g_id","23");
        if (error) {
            console.error("Error fetching games: ", error);
        } else {
            setGames(data);
        }
    };
    fetchGames();
    return (
        <div className="relative h-auto overflow-hidden flex flex-row flex-wrap gap-2.5 gap-y-2.5">
        {games.map((item,index)=>(
            <div key={index} className="relative w-[32%] h-32">
            <Link key={index} href={`/gameDetail/${item.g_id}`}>
            <img
                src={item.face_img}
                alt={`Game ${index}`}
                className="animate-fadeIn hover:cursor-pointer w-full h-full"
            />
            </Link>
            </div>
        ))}
        </div>
    );
}