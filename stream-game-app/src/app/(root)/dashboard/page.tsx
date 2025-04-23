"use client";
import Carousel from "@/components/dashboard/carousel/carousel" ;
import GameTable from "@/components/dashboard/gametable/gametable";

export default function Home() {
  return (
    <div>
      <div className="flex container items-center justify-center pt-16 pb-0">
        <Carousel>
        </Carousel>
      </div>
      <div className="pt-4 pb-20">
        <GameTable>
        </GameTable>
      </div>
    </div>
  );
}
