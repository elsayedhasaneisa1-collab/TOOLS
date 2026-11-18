import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/telegram": ["./src/bot/assets/**/*"],
  },
};

export default nextConfig;
