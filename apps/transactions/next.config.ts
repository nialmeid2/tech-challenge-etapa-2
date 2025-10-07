import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    eslint: {
        // Ignore ESLint during production build
        ignoreDuringBuilds: true,
    },
    output: "standalone",
    assetPrefix: '/transactions-static',
    
};

export default nextConfig;
