import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    eslint: {
        // Ignore ESLint during production build
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    output: 'standalone',
    assetPrefix: '/dashboard-static',
    experimental: {
        serverActions: {
            bodySizeLimit: '2mb',
        },
    },
};

export default nextConfig;
