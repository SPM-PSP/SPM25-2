import React from "react";

export default function Home({ params }: { params: { g_id: string } }) {
  const { g_id } = params;

  return (
    <div>
      <h1 className="text-3xl text-white">game detail: {g_id}</h1>
    </div>
  );
}
