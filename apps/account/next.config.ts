import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    assetPrefix: '/account-static',

    rollupOptions: {
        external: ["react", "react-dom", "next", "react-redux", "@reduxjs/toolkit"],
    },

};

export default nextConfig;
