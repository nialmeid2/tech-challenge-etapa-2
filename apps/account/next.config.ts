import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    
    eslint: {
        // Ignore ESLint during production build
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    /* config options here */
    output: "standalone",
    assetPrefix: '/account-static',
};

export default nextConfig;
