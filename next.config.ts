import type { NextConfig } from "next";

const securityHeaders = [
  // Prevents clickjacking attacks
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Stops MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Controls referrer information
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Restricts browser features
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
  // Forces HTTPS for 2 years, includes subdomains
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // XSS protection for legacy browsers
  { key: "X-XSS-Protection", value: "1; mode=block" },
  // Content Security Policy — tightened per-environment in production
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // unsafe-eval needed for Next.js dev; tighten in prod
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://images.unsplash.com",
      "connect-src 'self'",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  basePath,
  assetPrefix: basePath || undefined,

  // Apply security headers to all routes
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },

  images: {
    // AVIF first (smaller), WebP fallback — both superior to JPEG/PNG
    formats: ["image/avif", "image/webp"],
    // Explicit device sizes matching our breakpoint system
    deviceSizes: [375, 640, 768, 1024, 1280, 1536],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },

  experimental: {
    // Tree-shake large packages at build time
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },

  // Enforce strict TypeScript during builds
  typescript: { ignoreBuildErrors: false },

  // Compress responses
  compress: true,

  // Remove X-Powered-By header (security — don't advertise the stack)
  poweredByHeader: false,
};

export default nextConfig;
