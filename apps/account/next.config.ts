import type { NextConfig } from "next";

const nextConfig: NextConfig = {
<<<<<<< HEAD
    
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
=======
    /* config options here */
    assetPrefix: '/account-static',

    rollupOptions: {
        external: ["react", "react-dom", "next", "react-redux", "@reduxjs/toolkit"],
    },

>>>>>>> 9ca4f8aa147c7eb0fbce80f306ba5f8786f0124d
};

export default nextConfig;
