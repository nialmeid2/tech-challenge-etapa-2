import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    assetPrefix: '/dashboard-static',
    experimental: {
        serverActions: {
            bodySizeLimit: '2mb',
        },
    },
};

export default nextConfig;
