import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/user-form",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
