import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>dashboard</h1>

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
