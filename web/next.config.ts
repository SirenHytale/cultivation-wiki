import type { NextConfig } from "next";

/** One year, the max age worth setting on immutable, content-hashed assets. */
const YEAR = 60 * 60 * 24 * 365;

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Trailing slashes keep every URL byte-identical to the static site
  // (/dao/, /zh/dao/), so existing links and search results still resolve
  // without a redirect hop.
  trailingSlash: true,

  images: {
    // The only raster assets are the logo and the social card; both are local.
    formats: ["image/avif", "image/webp"],
  },

  async rewrites() {
    return [
      {
        // The Read API documentation page is a fully self-contained document
        // (its own <html>, own inline CSS, none of the site chrome), so it is
        // served verbatim from public/ rather than rebuilt as a route. Next
        // does not resolve a directory to its index.html on its own, hence the
        // explicit rewrite. Exact source only — /api/get/version/*.json and
        // the other JSON endpoints beneath it must keep resolving normally.
        source: "/api/get",
        destination: "/api/get/index.html",
      },
      {
        source: "/api/get/",
        destination: "/api/get/index.html",
      },
    ];
  },

  async headers() {
    return [
      {
        // The published JSON endpoints deployed mods poll for update and
        // compat checks. Short edge cache, long stale window: a release is
        // visible quickly, and an origin blip never breaks a client's check.
        source: "/api/get/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=60, s-maxage=300, stale-while-revalidate=86400",
          },
          { key: "Access-Control-Allow-Origin", value: "*" },
        ],
      },
      {
        // Images are content-addressed and never change in place.
        source: "/assets/img/:path*",
        headers: [{ key: "Cache-Control", value: `public, max-age=${YEAR}, immutable` }],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },
    ];
  },
};

export default nextConfig;
