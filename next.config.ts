import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopackを無効化してWebpackを使用する設定
  experimental: {
    // 特になしでOKですが、以下のように記述
  },
};

export default nextConfig;
