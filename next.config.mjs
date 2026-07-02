/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Allow Supabase storage URLs for item photos
      { protocol: 'https', hostname: '*.supabase.co' }
    ]
  },
  // Increase body size limit for image uploads (default is 1 MB)
  experimental: {
    serverActions: { bodySizeLimit: '10mb' }
  }
};

export default nextConfig;
