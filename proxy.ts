import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken } from "@/lib/auth";

function pathStartsWith(pathname: string, target: string): boolean {
  return pathname === target || pathname.startsWith(`${target}/`);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const protectedRoutes = ["/account", "/seller", "/admin"];
  const shouldProtect = protectedRoutes.some((route) => pathStartsWith(pathname, route));
  if (!shouldProtect) {
    return NextResponse.next();
  }

  const token = request.cookies.get("auth_token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  try {
    const payload = verifyAuthToken(token);

    if (pathStartsWith(pathname, "/admin") && payload.role !== "admin") {
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    if (pathStartsWith(pathname, "/seller") && !["seller", "admin"].includes(payload.role)) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    if (pathStartsWith(pathname, "/account") && !["customer", "seller", "admin"].includes(payload.role)) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/signin", request.url));
  }
}

export const config = {
  matcher: ["/account/:path*", "/seller/:path*", "/admin/:path*"],
};
