import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    async rewrites() {
        return [
            {
                source: '/home',
                destination: `http://localhost:3001/`,
            },
            {
                source: '/home/:path+',
                destination: `http://localhost:3001/:path+`,
            },
            {
                source: '/home-static/:path+',
                destination: `http://localhost:3001/home-static/:path+`,
            }
        ];
    }
};

export default nextConfig;
