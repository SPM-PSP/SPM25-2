"use client";
import React, { useState, useEffect } from "react";
import supabase from "@/lib/supabase";
import useUserStore from "@/lib/useUserStore";

interface RatingComponentProps {
  g_id: number;
}

const Stars: React.FC<{
  hoverRating: number;
  currentRating: number;
  handleMouseOver: (index: number) => void;
  handleMouseLeave: () => void;
  handleClick: (index: number) => void;
}> = ({
  hoverRating,
  currentRating,
  handleMouseOver,
  handleMouseLeave,
  handleClick,
}) => {
  const stars = [];
  for (let i = 1; i <= 10; i++) {
    stars.push(
      <svg
        key={i}
        xmlns="http://www.w3.org/2000/svg"
        fill={i <= (hoverRating || currentRating) ? "yellow" : "none"}
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="white"
        className="size-6 cursor-pointer"
        onMouseOver={() => handleMouseOver(i)}
        onMouseLeave={handleMouseLeave}
        onClick={() => handleClick(i)}
        style={{ width: "20px", height: "20px" }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
        />
      </svg>
    );
  }
  return <>{stars}</>;
};

const RatingComponent: React.FC<RatingComponentProps> = ({ g_id }) => {
  const { user } = useUserStore();
  const [currentRating, setCurrentRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    const loadCurrentRating = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from("rating")
        .select("rating")
        .eq("u_id", user.u_id)
        .eq("g_id", g_id)
        .single();
      if (data) {
        setCurrentRating(data.rating);
      }
    };
    loadCurrentRating();
  }, [user, g_id]);

  const handleClick = async (index: number) => {
    if (!user) {
      alert("请先登录");
      return;
    }
    setCurrentRating(index);
    const { error } = await supabase
      .from("rating")
      .upsert({ u_id: user.u_id, g_id, rating: index });
    if (error) {
      console.error("Error updating rating:", error);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Stars
        hoverRating={hoverRating}
        currentRating={currentRating}
        handleMouseOver={setHoverRating}
        handleMouseLeave={() => setHoverRating(0)}
        handleClick={handleClick}
      />
      <span className="text-white">{hoverRating || currentRating || 0}</span>
    </div>
  );
};

export default RatingComponent;
