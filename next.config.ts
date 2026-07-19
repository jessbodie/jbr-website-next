import type { NextConfig } from "next";
import path from "path";

// Origin of the standalone Rain Garden Advisor zone. Read at BUILD time, so a
// change requires a redeploy. Set per-environment in Vercel project settings to
// point previews at a preview deployment; falls back to the production alias.
const RAINGARDEN_ORIGIN =
  process.env.RAINGARDEN_ORIGIN ?? "https://raingarden-frontend.vercel.app";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  // Multi-zone: proxy /raingarden to the standalone Rain Garden Advisor app so
  // it serves from jessbodie.com/raingarden. The :path* rule also carries
  // /raingarden/_next/*, so its CSS, JS and photos resolve.
  async rewrites() {
    return [
      {
        source: "/raingarden",
        destination: `${RAINGARDEN_ORIGIN}/raingarden`,
      },
      {
        source: "/raingarden/:path*",
        destination: `${RAINGARDEN_ORIGIN}/raingarden/:path*`,
      },
    ];
  },
};

export default nextConfig;
