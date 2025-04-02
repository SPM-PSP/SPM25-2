import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div>
        <h1 className="text-white">（占位）图片轮播</h1>
      </div>
      <h1 className="text-white">（占位）强烈推荐</h1>
      <div>
        <h1 className="text-white">（占位）表格</h1>
      </div>
      <h1 className="text-white">dashboard</h1>

      <ul className="mt-10">
        <li>
          <Link href="/gameDetail/1">game 1</Link>
        </li>
        <li>
          <Link href="/gameDetail/2">game 2</Link>
        </li>
        <li>
          <Link href="/gameDetail/3">game 3</Link>
        </li>
        <li>
          <Link href="/gameDetail/4">game 4</Link>
        </li>
      </ul>
    </div>
  );
}
