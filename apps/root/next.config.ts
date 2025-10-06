import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "standalone",
    /* config options here */
    async rewrites() {
        return [
            // landing-page
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
            },

            // dashboard
            {
                source: '/dashboard',
                destination: `http://localhost:3002/`,
            },
            {
                source: '/dashboard/:path+',
                destination: `http://localhost:3002/:path+`,
            },
            {
                source: '/dashboard-static/:path+',
                destination: `http://localhost:3002/dashboard-static/:path+`
            },

            // transactions
            {
                source: '/transactions',
                destination: `http://localhost:3003/`,
            },
            {
                source: '/transactions/:path+',
                destination: `http://localhost:3003/:path+`,
            },
            {
                source: '/transactions-static/:path+',
                destination: `http://localhost:3003/transactions-static/:path+`
            },

            // investments
            {
                source: '/investments',
                destination: `http://localhost:3004/`,
            },
            {
                source: '/investments/:path+',
                destination: `http://localhost:3004/:path+`,
            },
            {
                source: '/investments-static/:path+',
                destination: `http://localhost:3004/investments-static/:path+`
            },


            // account
            {
                source: '/account',
                destination: `http://localhost:3005/`,
            },
            {
                source: '/account/:path+',
                destination: `http://localhost:3005/:path+`,
            },
            {
                source: '/account-static/:path+',
                destination: `http://localhost:3005/account-static/:path+`
            },
        ];
    }
};

export default nextConfig;
