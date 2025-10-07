import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    eslint: {
        // Ignore ESLint during production build
        ignoreDuringBuilds: true,
    },
    /* config options here */
    output: "standalone",
    assetPrefix: '/investments-static',
};

export default nextConfig;
