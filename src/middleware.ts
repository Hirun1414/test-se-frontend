import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const authProtectedPaths = ["/mybooking", "/booking", "/my", "/admin"];

function isAuthProtectedPath(pathname: string) {
  return authProtectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

export async function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const backendOrigin = process.env.BACKEND_URL || "http://localhost:5000";

  const cspHeader = [
    "default-src 'self'",
    [
      "script-src 'self'",
      `'nonce-${nonce}'`,
      "'sha256-OBTN3RiyCV4Bq7dFqZ5a2pAXjnCcCYeTJMO2I/LYKeo='",
      "'sha256-qODEg14l7xZdFNMFtnhrbIZVzKyDaWa55MwzqBQXt2E='",
      "'sha256-xpDrpzpTn2tdXq6E+e9CIqF3y8M5x6nKEgUOhJYTu7M='",
      "'sha256-g9jw4FPByfNOq5VGNsOvDbi4Vn4mZe8BWc/D40Nx4eM='",
      "'sha256-EQFH5gNLTpO0xm8NTwaiY2mh/6yLAiSipUxwuYKBp2A='",
      "'sha256-PuOR+LZBqrKb4ePpBB6hBCpSuljEq9ohELpHi6j0q8g='",
      "'sha256-VYyKTXy5HaLVE7BeKFdiRJzza7OtcslsnhHhTDCInEA='",
      "'sha256-i/k9dNlim2bw/P4uBE6H5TkwSixGtVIyDp1QCZNZnrE='",
    ].join(" "),
    `style-src 'self' 'nonce-${nonce}'`,
    "img-src 'self' data: blob: https://drive.google.com",
    "font-src 'self'",
    `connect-src 'self' ${backendOrigin}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "frame-src 'none'",
    "media-src 'self'",
    "manifest-src 'self'",
    "worker-src 'self'",
    "script-src-attr 'none'",
    "style-src-attr 'none'",
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", cspHeader);

  let response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  if (isAuthProtectedPath(request.nextUrl.pathname)) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
      response = NextResponse.redirect(loginUrl);
    }
  }

  response.headers.set("Content-Security-Policy", cspHeader);
  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
