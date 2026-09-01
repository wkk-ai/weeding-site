import type { NextConfig } from "next";

const isStaticExport = process.env.STATIC_EXPORT === "1";
const isGitHubPages = process.env.GITHUB_PAGES === "1";
const githubPagesBasePath = "/weeding-site";

const nextConfig: NextConfig = {
  ...(isStaticExport
    ? {
        output: "export",
        trailingSlash: true,
      }
    : {
        output: "standalone",
      }),
  ...(isGitHubPages
    ? {
        basePath: githubPagesBasePath,
      }
    : {}),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
