/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",  // <=== enables static exports
    reactStrictMode: true,
    trailingSlash: false,
    images: {
        unoptimized: true,
    },
};

module.exports = nextConfig;