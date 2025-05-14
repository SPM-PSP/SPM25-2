// app/(root)/searchPage/page.tsx
import React, { Suspense } from "react";
import SearchResults from "./SearchResults";

export default function SearchPage() {
  return (
    <div>
      <h1 className="text-white text-2xl p-4">游戏搜索</h1>
      <Suspense fallback={<div className="text-center p-4">加载中...</div>}>
        <SearchResults />
      </Suspense>
    </div>
  );
}
