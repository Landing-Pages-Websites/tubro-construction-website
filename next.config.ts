import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{
      protocol: "https",
      hostname: "zleague-public-prod.s3.us-east-2.amazonaws.com",
      pathname: "/article_images/b002784f-9543-4362-8814-b7da19078f23/small-bathroom-ideas-that-improve-function-storage-and-comfort-299609.webp",
      search: "",
    }, {
      protocol: "https",
      hostname: "zleague-public-prod.s3.us-east-2.amazonaws.com",
      pathname: "/article_images/b002784f-9543-4362-8814-b7da19078f23/drywall-installation-what-homeowners-should-expect-from-a-professional-project-230918.webp",
      search: "",
    }],
  },
  async redirects() {
    return [
      {
        source: "/how-much-does-it-cost-to-replace-kitchen-cabinets",
        destination: "/how-much-do-kitchen-cabinets-cost",
        statusCode: 301,
      },
      {
        source: "/do-you-need-permits-for-a-home-remodel-in-maple-valley-wa",
        destination: "/do-i-need-permits-for-a-home-remodel-in-maple-valley-wa",
        statusCode: 301,
      },
      {
        source: "/Bathroom-Remodels-Kent-WA",
        destination: "/bathroom-remodeling",
        statusCode: 301,
      },
    ];
  },
};

export default nextConfig;
