import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org", // Allow images from TMDB
        pathname: "/t/p/**" // Allow all paths under /t/p/
      }
    ]
  }
};

export default nextConfig;
