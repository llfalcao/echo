/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  images: {
    remotePatterns: [
      { hostname: "i.imgur.com" },
      { hostname: "thumbs2.imgbox.com" },
      { hostname: "picsum.photos" },
    ],
  },
};

module.exports = nextConfig;
