/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    productionBrowserSourceMaps: true,
    reactStrictMode: true,
    staticPageGenerationTimeout: 300,
    // images: {
    //     remotePatterns: [
    //         {
    //             protocol: 'https',
    //             hostname: 'i.imgur.com',
    //             port: '',
    //         },
    //         {
    //             protocol: 'https',
    //             hostname: 'firebasestorage.googleapis.com',
    //             port: '',
    //         },
    //     ],
    // },
}

module.exports = nextConfig
