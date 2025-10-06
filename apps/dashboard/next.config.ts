import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: 'standalone',
    assetPrefix: '/dashboard-static',
    experimental: {
        serverActions: {
            bodySizeLimit: '2mb',
        },
    },
};

export default nextConfig;
