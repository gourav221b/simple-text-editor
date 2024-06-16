/** @type {import('next').NextConfig} */
import withPWAInit from "@ducanh2912/next-pwa";
const withPWA = withPWAInit({
    dest: "public",
    disable: process.env.NODE_ENV === "development",
    register: true,
    scope: "/",
    sw: "service-worker.js",

});

const nextConfig = withPWA({

    async redirects() {
        return [
            {
                source: '/meet',
                destination: 'https://meet.google.com/viq-xrcp-hyj',
                permanent: true,
            },
        ]
    },
});

export default nextConfig;
