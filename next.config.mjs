/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static HTML export — produces an `out/` folder that AWS Amplify hosts as a static site.
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
