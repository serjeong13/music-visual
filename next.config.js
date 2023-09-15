/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = {
  reactStrictMode: true,
  images: {
    domains: [
      "mosaic.scdn.co",
      "i.scdn.co",
      "images-ak.spotifycdn.com",
      "image-cdn-ak.spotifycdn.com",
    ],
  },
};
