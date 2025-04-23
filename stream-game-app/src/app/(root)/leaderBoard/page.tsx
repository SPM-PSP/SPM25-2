"use client";
import React from "react";
import supabase from "@/lib/supabase";
import { useRouter } from "next/navigation";
import useUserStore from "@/lib/useUserStore";

export default function Home() {
  return (
    <div>
      <h1 className="text-white">leaderBoard</h1>
    </div>
    
  );
}
