/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    VIVA_CLIENT_ID: process.env.VIVA_CLIENT_ID,
    VIVA_CLIENT_SECRET: process.env.VIVA_CLIENT_SECRET,
    VIVA_SOURCE_CODE: process.env.VIVA_SOURCE_CODE,
    VIVA_API_URL: process.env.VIVA_API_URL,
    VIVA_TOKEN_URL: process.env.VIVA_TOKEN_URL,
  },
};

module.exports = nextConfig;
