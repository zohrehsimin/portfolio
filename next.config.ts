import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // خروجی کاملاً استاتیک (HTML/CSS/JS)
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

