export default {
  // copy options from next.config.ts but remove TS types (e.g. NextConfig)
  // reactStrictMode: true,
  // swcMinify: true,
  // ...other options...
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**"
      }
    ]
    // OR use domains: ["picsum.photos"] if you prefer a simple whitelist
  },
};