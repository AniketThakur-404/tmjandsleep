import type { NextConfig } from "next";
import { TEMPLATE_PAGE } from "./src/lib/site";

/**
 * This project is a single landing page (/tmj-pain-headache/). Menu and footer
 * links go straight to the main live site (see src/lib/site.ts); the only
 * redirects needed here send this project's home page and old preview
 * addresses to the landing page.
 */
const redirectPaths = ["/", "/jaw-pain-headaches", "/contact-us", "/book-with-us"];

const nextConfig: NextConfig = {
  // Match the live URL format: https://www.tmjandsleep.com.au/tmj-pain-headache/
  trailingSlash: true,
  async redirects() {
    return redirectPaths.map((source) => ({ source, destination: TEMPLATE_PAGE, permanent: false }));
  },
};

export default nextConfig;
