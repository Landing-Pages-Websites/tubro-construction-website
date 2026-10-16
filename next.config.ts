import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{
      // MEGA-published article hero images for this customer only.
      protocol: "https",
      hostname: "zleague-public-prod.s3.us-east-2.amazonaws.com",
      pathname: "/article_images/b002784f-9543-4362-8814-b7da19078f23/**",
      search: "",
    }],
  },
  async redirects() {
    return [
      // Approved articles link to these paths; the posts live at the destinations.
      { source: "/how-to-hire-a-remodeling-contractor-western-washington", destination: "/blog/how-to-hire-a-remodeling-contractor-western-washington", permanent: true },
      { source: "/bathroom-remodel-cost-western-washington", destination: "/bathroom-remodel-cost-in-western-washington", permanent: true },
    ];
  },
};

export default nextConfig;
