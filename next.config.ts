import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "drive.google.com",
      },
    ],
  },

  async headers() {
    const backendOrigin = process.env.BACKEND_URL || "http://localhost:5000";

    return [
      {
        // Apply to every frontend route so the scanner sees the headers on "/"
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self'",
              "style-src 'self'",
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
            ].join("; "),
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "no-referrer",
          },
        ],
      },
    ];
  },

  env: {
    FRONTEND_URL: process.env.FRONTEND_URL,
    BACKEND_URL: process.env.BACKEND_URL,
  },
};

export default nextConfig;