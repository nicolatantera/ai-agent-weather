import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    BACKEND_DOMAIN: 'http://localhost:8787'
  }
};

export default nextConfig;
