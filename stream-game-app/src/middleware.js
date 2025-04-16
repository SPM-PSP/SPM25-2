import { NextResponse } from "next/server";

export function middleware(request) {
  //console.log("Middleware is running!"); // 打印日志到终端
  const url = request.nextUrl;

  if (url.pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
