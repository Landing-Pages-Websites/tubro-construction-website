import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{
      protocol: "https",
      hostname: "zleague-public-prod.s3.us-east-2.amazonaws.com",
      pathname: "/article_images/b002784f-9543-4362-8814-b7da19078f23/small-bathroom-ideas-that-improve-function-storage-and-comfort-299609.webp",
      search: "",
    },
    {
      protocol: "https",
      hostname: "zleague-public-prod.s3.us-east-2.amazonaws.com",
      pathname: "/article_images/b002784f-9543-4362-8814-b7da19078f23/how-much-does-a-kitchen-remodel-cost-in-king-county-622939.webp",
      search: "",
    }],
  },
};

export default nextConfig;
