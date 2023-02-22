/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: ["i.imgur.com", "thumbs2.imgbox.com"],
  },
};

module.exports = nextConfig;
