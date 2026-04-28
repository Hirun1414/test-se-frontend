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
  const backendOrigin = process.env.BACKEND_URL?.trim();
  const scriptSrc = `script-src 'self' 'nonce-${nonce}'`;

  const styleSrc = `style-src 'self' 'nonce-${nonce}'`;

  const cspHeader = [
    "default-src 'self'",
    scriptSrc,
    styleSrc,
    "img-src 'self' data: blob: https://drive.google.com",
    "font-src 'self'",
    backendOrigin ? `connect-src 'self' ${backendOrigin}` : "connect-src 'self'",
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
