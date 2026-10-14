import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  trailingSlash: true,
  outputFileTracingIncludes: {
    "/*": ["./src/data/content/**/*.json", "./src/data/content-en/**/*.json"],
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
      {
        source: "/%D7%A8%D7%99%D7%9E%D7%A8%D7%A7%D7%98%D7%99%D7%A0%D7%92-%D7%9E%D7%94-%D7%96%D7%94-%D7%95%D7%90%D7%99%D7%9A-%D7%95%D7%9C%D7%9E%D7%94",
        destination:
          "/%D7%A8%D7%99%D7%9E%D7%A8%D7%A7%D7%98%D7%99%D7%A0%D7%92-%D7%9E%D7%94-%D7%96%D7%94-%D7%90%D7%99%D7%9A-%D7%95%D7%9C%D7%9E%D7%94/",
        permanent: true,
      },
      {
        source: "/%D7%A8%D7%99%D7%9E%D7%A8%D7%A7%D7%98%D7%99%D7%A0%D7%92-%D7%9E%D7%94-%D7%96%D7%94-%D7%95%D7%90%D7%99%D7%9A-%D7%95%D7%9C%D7%9E%D7%94/",
        destination:
          "/%D7%A8%D7%99%D7%9E%D7%A8%D7%A7%D7%98%D7%99%D7%A0%D7%92-%D7%9E%D7%94-%D7%96%D7%94-%D7%90%D7%99%D7%9A-%D7%95%D7%9C%D7%9E%D7%94/",
        permanent: true,
      },
      {
        source: "/en/how-to-choose-digital-marketing-company",
        destination: "/en/choosing-digital-marketing-agency/",
        permanent: true,
      },
      {
        source: "/en/how-to-choose-digital-marketing-company/",
        destination: "/en/choosing-digital-marketing-agency/",
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

export default withNextIntl(nextConfig);
