import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    async rewrites() {
        return [
            // landing-page
            {
                source: '/home',
                destination: `${process.env.DOMAIN_HOME}`,
            },
            {
                source: '/home/:path+',
                destination: `${process.env.DOMAIN_HOME}:path+`,
            },
            {
                source: '/home-static/:path+',
                destination: `${process.env.DOMAIN_HOME}home-static/:path+`,
            },

            // dashboard
            {
                source: '/dashboard',
                destination: `${process.env.DOMAIN_DASHBOARD}`,
            },
            {
                source: '/dashboard/:path+',
                destination: `${process.env.DOMAIN_DASHBOARD}:path+`,
            },
            {
                source: '/dashboard-static/:path+',
                destination: `${process.env.DOMAIN_DASHBOARD}dashboard-static/:path+`
            },

            // transactions
            {
                source: '/transactions',
                destination: `${process.env.DOMAIN_TRANSACTIONS}`,
            },
            {
                source: '/transactions/:path+',
                destination: `${process.env.DOMAIN_TRANSACTIONS}:path+`,
            },
            {
                source: '/transactions-static/:path+',
                destination: `${process.env.DOMAIN_TRANSACTIONS}transactions-static/:path+`
            },

            // investments
            {
                source: '/investments',
                destination: `${process.env.DOMAIN_INVESTMENTS}`,
            },
            {
                source: '/investments/:path+',
                destination: `${process.env.DOMAIN_INVESTMENTS}:path+`,
            },
            {
                source: '/investments-static/:path+',
                destination: `${process.env.DOMAIN_INVESTMENTS}investments-static/:path+`
            },


            // account
            {
                source: '/account',
                destination: `${process.env.DOMAIN_ACCOUNT}`,
            },
            {
                source: '/account/:path+',
                destination: `${process.env.DOMAIN_ACCOUNT}:path+`,
            },
            {
                source: '/account-static/:path+',
                destination: `${process.env.DOMAIN_ACCOUNT}account-static/:path+`
            },
        ];
    }
};

export default nextConfig;
