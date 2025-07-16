/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // ✅ This is required for Railway custom server deploy
};

export default nextConfig;
