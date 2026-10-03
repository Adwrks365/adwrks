import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  outputFileTracingIncludes: {
    "/*": ["./src/data/content/**/*.json"],
  },
  async redirects() {
    return [
      {
        source: "/plans",
        destination: "/hosting-plans/",
        permanent: true,
      },
      {
        source: "/contact/",
        destination: "/contact-us/",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "adwrks.co.il",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "www.adwrks.co.il",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "secure.gravatar.com",
      },
      {
        protocol: "https",
        hostname: "www.gstatic.com",
        pathname: "/partners/**",
      },
    ],
  },
};

export default nextConfig;
