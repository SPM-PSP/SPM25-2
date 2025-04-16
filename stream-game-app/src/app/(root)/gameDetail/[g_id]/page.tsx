import React from "react";

export default async function Home({ params }: { params: { g_id: string } }) {
  const { g_id } = await params;

  return (
    <div>
      <h1 className="text-3xl text-white">game detail: {g_id}</h1>
    </div>
  );
}
