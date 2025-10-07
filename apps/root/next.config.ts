import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    

    output: "standalone",
    /* config options here */
    async rewrites() {
        return [
            // landing-page
            {
                source: '/home',
                destination: `${process.env['landing_page_url']}`,
            },
            {
                source: '/home/:path+',
                destination: `${process.env['landing_page_url']}:path+`,
            },
            {
                source: '/home-static/:path+',
                destination: `${process.env['landing_page_url']}home-static/:path+`,
            },

            // dashboard
            {
                source: '/dashboard',
                destination: `${process.env['dashboard_page_url']}`,
            },
            {
                source: '/dashboard/:path+',
                destination: `${process.env['dashboard_page_url']}:path+`,
            },
            {
                source: '/dashboard-static/:path+',
                destination: `${process.env['dashboard_page_url']}dashboard-static/:path+`
            },

            // transactions
            {
                source: '/transactions',
                destination: `${process.env['transactions_page_url']}`,
            },
            {
                source: '/transactions/:path+',
                destination: `${process.env['transactions_page_url']}:path+`,
            },
            {
                source: '/transactions-static/:path+',
                destination: `${process.env['transactions_page_url']}transactions-static/:path+`
            },

            // investments
            {
                source: '/investments',
                destination: `${process.env['investments_page_url']}`,
            },
            {
                source: '/investments/:path+',
                destination: `${process.env['investments_page_url']}:path+`,
            },
            {
                source: '/investments-static/:path+',
                destination: `${process.env['investments_page_url']}investments-static/:path+`
            },


            // account
            {
                source: '/account',
                destination: `${process.env['account_page_url']}`,
            },
            {
                source: '/account/:path+',
                destination: `${process.env['account_page_url']}:path+`,
            },
            {
                source: '/account-static/:path+',
                destination: `${process.env['account_page_url']}account-static/:path+`
            },
        ];
    }
};

export default nextConfig;
