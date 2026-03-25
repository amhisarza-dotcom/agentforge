import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default-secret-change-me");
const protectedRoutes = ["/dashboard", "/agents"];
const authRoutes = ["/login", "/register"];
export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
    const { pathname } = request.nextUrl;
      const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
        const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
          if (isProtected) {
              if (!token) return NextResponse.redirect(new URL("/login", request.url));
                  try { await jwtVerify(token, secret); return NextResponse.next(); } catch { return NextResponse.redirect(new URL("/login", request.url)); }
                    }
                      if (isAuthRoute && token) {
                          try { await jwtVerify(token, secret); return NextResponse.redirect(new URL("/dashboard", request.url)); } catch { return NextResponse.next(); }
                            }
                              return NextResponse.next();
                              }
                              export const config = { matcher: ["/dashboard/:path*", "/agents/:path*", "/login", "/register"] };
