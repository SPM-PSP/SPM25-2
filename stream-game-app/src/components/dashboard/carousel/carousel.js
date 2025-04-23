import supabase from "@/lib/supabase";
import { useEffect, useState } from "react";
import Swipe from "react-easy-swipe";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import "./carousel.css";
import { useRouter } from "next/navigation";

export default function Carousel() {
  const router = useRouter();
  const [games, setGames] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const fetchGames = async () => {
    const { data, error } = await supabase
      .from("game")
      .select("*")
      .in("g_id", [1, 12, 13, 23]);

    if (error) {
      console.error("Error fetching games: ", error);
    } else {
      setGames(data);
    }
  };

  useEffect(() => {
    if (isPaused) return; // 如果暂停则不设置计时器
    const interval = setInterval(() => {
      handleNextSlide();
    }, 5000); // 每五秒切换一次

    // 获取游戏数据
    fetchGames();

    return () => {
      clearInterval(interval);
    };
  }, [currentSlide, isPaused]);

  const handleNextSlide = () => {
    let newSlide = currentSlide === games.length - 1 ? 0 : currentSlide + 1;
    setCurrentSlide(newSlide);
  };

  const handlePrevSlide = () => {
    let newSlide = currentSlide === 0 ? games.length - 1 : currentSlide - 1;
    setCurrentSlide(newSlide);
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  const handleClick = (game) => {
    setTimeout(() => {
      router.push(`/gameDetail/${game.g_id}`);
    }, 300);
  };

  return (
    <div className="relative w-full">
      <div className="relative mx-auto">
        <AiOutlineLeft
          onClick={handlePrevSlide}
          className="absolute left-0 m-auto text-5xl inset-y-1/2 cursor-pointer text-gray-400 z-20"
        />
        <div className="w-full h-[60vh] flex overflow-hidden relative m-auto">
          <Swipe
            onSwipeLeft={handleNextSlide}
            onSwipeRight={handlePrevSlide}
            className="relative z-10 w-full h-full"
          >
            {games.map((game, index) => (
              <div
                key={index}
                className={`carousel-item ${
                  index === currentSlide ? "active" : ""
                } ${
                  index === (currentSlide - 1 + games.length) % games.length
                    ? "previous"
                    : ""
                } ${index === (currentSlide + 1) % games.length ? "next" : ""}`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <img
                  src={game.face_img}
                  layout="fill"
                  objectfit="contain"
                  className="animate-fadeIn hover:cursor-pointer w-full h-full"
                  onClick={() => handleClick(game)}
                  alt={`Game ${index}`}
                />
              </div>
            ))}
          </Swipe>
        </div>
        <AiOutlineRight
          onClick={handleNextSlide}
          className="absolute right-0 m-auto text-5xl inset-y-1/2 cursor-pointer text-gray-400 z-20"
        />

        <div className="relative flex justify-center p-2">
          {games.map((_, index) => (
            <div
              key={index}
              className={
                index === currentSlide
                  ? "h-4 w-6 bg-gray-700 rounded-full mx-2 mb-2 cursor-pointer"
                  : "h-4 w-4 bg-gray-300 rounded-full mx-2 mb-2 cursor-pointer"
              }
              onClick={() => {
                setCurrentSlide(index);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
